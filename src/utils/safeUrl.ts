/**
 * Validate navigation/link URLs before assigning to href / window.open / location.
 * Blocks javascript:, data:, vbscript:, file:, blob:, and protocol-relative (//) URLs.
 */
export function sanitizeNavigationUrl(raw?: string | null): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const cleaned = raw.replace(/[\x00-\x1f\x7f]/g, '').trim();
  if (!cleaned) return null;

  if (cleaned.startsWith('#') || cleaned.startsWith('/#')) {
    return cleaned;
  }

  if (cleaned.startsWith('/')) {
    if (cleaned.startsWith('//') || /^\/\\/.test(cleaned)) return null;
    if (/^\/[^\s\\]*$/.test(cleaned)) return cleaned;
    return null;
  }

  try {
    const parsed = new URL(cleaned);
    if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && !parsed.username && !parsed.password) {
      return parsed.toString();
    }
  } catch {
    // Reject malformed URLs
  }

  return null;
}

/**
 * Strictly requires an https:// URL without embedded credentials (used for payment redirects).
 */
export function isSafeHttpsUrl(raw?: string | null): boolean {
  if (!raw || typeof raw !== 'string') return false;
  const cleaned = raw.replace(/[\x00-\x1f\x7f]/g, '').trim();
  if (!cleaned) return false;
  try {
    const parsed = new URL(cleaned);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}
