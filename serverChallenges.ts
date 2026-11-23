import crypto from 'node:crypto';
import { SecurityDb } from './serverDb';
import { getUserSigningSecret } from './serverSecurity';

type Purpose = 'email-verification' | 'password-reset' | 'sms-login';

function keyFor(purpose: Purpose, subject: string): string {
  return `challenge:${purpose}:${crypto.createHmac('sha256', getUserSigningSecret()).update(subject).digest('hex')}`;
}

function verifier(key: string, code: string): string {
  return crypto.createHmac('sha256', getUserSigningSecret()).update(`${key}:${code}`).digest('hex');
}

export async function issueChallenge(purpose: Purpose, subject: string, lifetime: number) {
  const key = keyFor(purpose, subject);
  const code = crypto.randomInt(100000, 1000000).toString();
  const value = verifier(key, code);
  const issued = await SecurityDb.issueChallenge(key, value, lifetime);
  if (!issued) return null;
  return { code, invalidate: () => SecurityDb.finishChallenge(key, value) };
}

export async function useChallenge(purpose: Purpose, subject: string, code: unknown): Promise<boolean> {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) return false;
  const key = keyFor(purpose, subject);
  const value = verifier(key, code.trim());
  return SecurityDb.consumeChallenge(key, value);
}
