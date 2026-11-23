// -------------------------------------------------------------
// SERVER SECURITY: RATE LIMITING & BRUTE-FORCE PROTECTION
// -------------------------------------------------------------
import type { Request } from 'express';
import crypto from 'crypto';

// -------------------------------------------------------------
// CRYPTOGRAPHIC SECRETS & KEY MANAGEMENT (HMAC-SHA256)
// Prevents hardcoded fallback keys from being exploited.
// If environment variables are missing, an unguessable 256-bit
// ephemeral secret is generated in server memory at startup.
// -------------------------------------------------------------
const ephemeralAdminSecret = crypto.randomBytes(32).toString('hex');
const ephemeralTechSecret = crypto.randomBytes(32).toString('hex');
const ephemeralUserSecret = crypto.randomBytes(32).toString('hex');

let adminSecretWarned = false;
let techSecretWarned = false;

export function getAdminSigningSecret(): string {
  const secret = (
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_PASS ||
    process.env.TURSO_AUTH_TOKEN
  );
  if (!secret) {
    if (!adminSecretWarned) {
      console.warn('[SECURITY WARNING] ADMIN_PASSWORD or TURSO_AUTH_TOKEN is not set in environment variables. Generated an unguessable ephemeral in-memory signing secret for admin authentication.');
      adminSecretWarned = true;
    }
    return ephemeralAdminSecret;
  }
  return secret;
}

export function getTechSigningSecret(): string {
  const secret = (
    process.env.TECH_ADMIN_PASSWORD ||
    process.env.TECH_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    process.env.TURSO_AUTH_TOKEN
  );
  if (!secret) {
    if (!techSecretWarned) {
      console.warn('[SECURITY WARNING] TECH_ADMIN_PASSWORD is not set in environment variables. Generated an unguessable ephemeral in-memory signing secret for tech-admin authentication.');
      techSecretWarned = true;
    }
    return ephemeralTechSecret;
  }
  return secret;
}

export function getUserSigningSecret(): string {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (secret && Buffer.byteLength(secret) >= 32) return secret;
  if (process.env.VERCEL || process.env.VERCEL_ENV || process.env.NODE_ENV === 'production') {
    throw new Error('A dedicated CUSTOMER_SESSION_SECRET is required.');
  }
  return ephemeralUserSecret;
}

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  lockedUntil: number | null;
}

export class AuthRateLimiter {
  private attempts = new Map<string, AttemptRecord>();
  private readonly maxAttempts: number;
  private readonly lockoutWindowMs: number;
  private readonly attemptWindowMs: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(options?: { maxAttempts?: number; lockoutMinutes?: number; windowMinutes?: number }) {
    this.maxAttempts = options?.maxAttempts ?? 5;
    this.lockoutWindowMs = (options?.lockoutMinutes ?? 15) * 60 * 1000; // default 15 mins
    this.attemptWindowMs = (options?.windowMinutes ?? 15) * 60 * 1000;  // default 15 mins

    // Automatic cleanup of stale records every 5 minutes
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanupStaleRecords();
      }, 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Helper to normalize identifiers (emails, usernames)
   */
  private normalizeIdentifier(identifier: string): string {
    return (identifier || '').trim().toLowerCase();
  }

  /**
   * Generates cache keys for account identifier and IP address
   */
  private getKeys(scope: string, identifier: string, ip: string): { idKey: string; ipKey: string } {
    const cleanId = this.normalizeIdentifier(identifier) || 'anonymous';
    const cleanIp = (ip || '127.0.0.1').trim();
    return {
      idKey: `${scope}:id:${cleanId}`,
      ipKey: `${scope}:ip:${cleanIp}`,
    };
  }

  /**
   * Check if either the account identifier or the IP is currently locked out
   */
  public checkLimit(scope: string, identifier: string, ip: string): {
    isLocked: boolean;
    remainingSeconds: number;
    remainingAttempts: number;
    attemptsCount: number;
    lockedReason?: 'account' | 'ip';
  } {
    const now = Date.now();
    const { idKey, ipKey } = this.getKeys(scope, identifier, ip);

    const idRecord = this.attempts.get(idKey);
    const ipRecord = this.attempts.get(ipKey);

    // Check account lockout
    if (idRecord && idRecord.lockedUntil) {
      if (now < idRecord.lockedUntil) {
        const remainingSeconds = Math.ceil((idRecord.lockedUntil - now) / 1000);
        return {
          isLocked: true,
          remainingSeconds,
          remainingAttempts: 0,
          attemptsCount: idRecord.count,
          lockedReason: 'account',
        };
      } else {
        // Lockout expired, reset record
        this.attempts.delete(idKey);
      }
    }

    // Check IP lockout
    if (ipRecord && ipRecord.lockedUntil) {
      if (now < ipRecord.lockedUntil) {
        const remainingSeconds = Math.ceil((ipRecord.lockedUntil - now) / 1000);
        return {
          isLocked: true,
          remainingSeconds,
          remainingAttempts: 0,
          attemptsCount: ipRecord.count,
          lockedReason: 'ip',
        };
      } else {
        // Lockout expired, reset record
        this.attempts.delete(ipKey);
      }
    }

    // Calculate maximum failed attempts between identifier and IP
    const currentIdCount = idRecord && (now - idRecord.lastAttemptAt < this.attemptWindowMs) ? idRecord.count : 0;
    const currentIpCount = ipRecord && (now - ipRecord.lastAttemptAt < this.attemptWindowMs) ? ipRecord.count : 0;
    const maxCurrent = Math.max(currentIdCount, currentIpCount);
    const remainingAttempts = Math.max(0, this.maxAttempts - maxCurrent);

    return {
      isLocked: false,
      remainingSeconds: 0,
      remainingAttempts,
      attemptsCount: maxCurrent,
    };
  }

  /**
   * Record a failed login attempt for both the identifier and IP.
   * If threshold is reached, locks the account and/or IP.
   */
  public recordFailedAttempt(scope: string, identifier: string, ip: string): {
    isLocked: boolean;
    remainingSeconds: number;
    remainingAttempts: number;
    attemptsCount: number;
    lockedReason?: 'account' | 'ip';
  } {
    const now = Date.now();
    const { idKey, ipKey } = this.getKeys(scope, identifier, ip);

    // Update ID record
    let idRecord = this.attempts.get(idKey);
    if (!idRecord || (now - idRecord.lastAttemptAt > this.attemptWindowMs)) {
      idRecord = { count: 1, firstAttemptAt: now, lastAttemptAt: now, lockedUntil: null };
    } else {
      idRecord.count += 1;
      idRecord.lastAttemptAt = now;
    }

    if (idRecord.count >= this.maxAttempts && !idRecord.lockedUntil) {
      idRecord.lockedUntil = now + this.lockoutWindowMs;
    }
    this.attempts.set(idKey, idRecord);

    // Update IP record
    let ipRecord = this.attempts.get(ipKey);
    if (!ipRecord || (now - ipRecord.lastAttemptAt > this.attemptWindowMs)) {
      ipRecord = { count: 1, firstAttemptAt: now, lastAttemptAt: now, lockedUntil: null };
    } else {
      ipRecord.count += 1;
      ipRecord.lastAttemptAt = now;
    }

    if (ipRecord.count >= this.maxAttempts && !ipRecord.lockedUntil) {
      ipRecord.lockedUntil = now + this.lockoutWindowMs;
    }
    this.attempts.set(ipKey, ipRecord);

    // Determine if locked
    if (idRecord.lockedUntil && now < idRecord.lockedUntil) {
      const remainingSeconds = Math.ceil((idRecord.lockedUntil - now) / 1000);
      return {
        isLocked: true,
        remainingSeconds,
        remainingAttempts: 0,
        attemptsCount: idRecord.count,
        lockedReason: 'account',
      };
    }

    if (ipRecord.lockedUntil && now < ipRecord.lockedUntil) {
      const remainingSeconds = Math.ceil((ipRecord.lockedUntil - now) / 1000);
      return {
        isLocked: true,
        remainingSeconds,
        remainingAttempts: 0,
        attemptsCount: ipRecord.count,
        lockedReason: 'ip',
      };
    }

    const currentCount = Math.max(idRecord.count, ipRecord.count);
    const remainingAttempts = Math.max(0, this.maxAttempts - currentCount);

    return {
      isLocked: false,
      remainingSeconds: 0,
      remainingAttempts,
      attemptsCount: currentCount,
    };
  }

  /**
   * Reset attempts on successful login
   */
  public clearAttempts(scope: string, identifier: string, ip: string): void {
    const { idKey, ipKey } = this.getKeys(scope, identifier, ip);
    this.attempts.delete(idKey);
    this.attempts.delete(ipKey);
  }

  /**
   * Remove records older than the attempt window to prevent memory leaks
   */
  private cleanupStaleRecords(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (record.lockedUntil) {
        if (now >= record.lockedUntil) {
          this.attempts.delete(key);
        }
      } else if (now - record.lastAttemptAt > this.attemptWindowMs) {
        this.attempts.delete(key);
      }
    }
  }
}

/**
 * Singleton rate limiter instance for user and admin login protection
 * 5 attempts within 15 minutes -> 15-minute temporary lockout
 */
export const authRateLimiter = new AuthRateLimiter({
  maxAttempts: 5,
  lockoutMinutes: 15,
  windowMinutes: 15,
});

/**
 * Dedicated Rate Limiter for SMS / OTP dispatch (prevents SMS bombing & financial exhaustion)
 * Maximum 5 OTP requests per phone/IP per 15 minutes
 */
export const otpRateLimiter = new AuthRateLimiter({
  maxAttempts: 5,
  lockoutMinutes: 15,
  windowMinutes: 15,
});

/**
 * Dedicated Rate Limiter for File Uploads
 * Maximum 15 uploads per IP per 10 minutes
 */
export const uploadRateLimiter = new AuthRateLimiter({
  maxAttempts: 15,
  lockoutMinutes: 10,
  windowMinutes: 10,
});

/**
 * Escape HTML special characters to prevent Cross-Site Scripting (XSS)
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Reliable extraction of client IP across reverse proxies, Cloud Run, Vercel, and Cloudflare
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.length > 0) {
    return realIp.trim();
  }
  return req.socket.remoteAddress || req.ip || '127.0.0.1';
}

