/**
 * Central utility for Admin route configuration and security normalization.
 * Configured via Vite environment variable VITE_ADMIN_PATH (default: '/vara-admin-panel').
 */

export function getAdminPath(): string {
  const envPath = (import.meta as any).env?.VITE_ADMIN_PATH;
  if (typeof envPath === 'string' && envPath.trim().length > 0) {
    const trimmed = envPath.trim();
    const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    // Strip trailing slash if not root
    return withLeading.length > 1 && withLeading.endsWith('/')
      ? withLeading.slice(0, -1).toLowerCase()
      : withLeading.toLowerCase();
  }
  return '/vara-admin-panel';
}

/**
 * Checks whether the current path or hash matches the secret admin path.
 * Strict: legacy /admin or /cms are explicitly rejected to prevent automated scanners
 * from finding the panel.
 */
export function isAdminRoute(pathOrHash: string): boolean {
  if (!pathOrHash) return false;
  const adminPath = getAdminPath();
  const normalized = pathOrHash.toLowerCase().split('?')[0].split('#')[0].replace(/\/+$/, '');

  // Exact match with configured admin path, or standard /admin and /cms routes
  if (normalized === adminPath || normalized === '/admin' || normalized === '/cms') return true;

  // Hash route matching (e.g. #/vara-admin-panel, #admin, #/admin, #cms, #/cms)
  if (pathOrHash.startsWith('#')) {
    const hashClean = pathOrHash.replace(/^#\/?/, '/').toLowerCase().split('?')[0].replace(/\/+$/, '');
    if (hashClean === adminPath || hashClean === '/admin' || hashClean === '/cms') return true;
  }

  return false;
}
