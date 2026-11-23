const ADMIN_TOKEN_KEY = 'vara_admin_token';

export function getAdminToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {}
}

export function clearAdminToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {}
}

export function getAdminAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getAdminToken();
  if (!token) return { ...extraHeaders };
  return {
    ...extraHeaders,
    'Authorization': `Bearer ${token}`,
    'x-admin-token': token,
  };
}

// Verify entered credentials against the database API
export async function verifyAdminCredentialsInDb(
  enteredUserOrEmail: string, 
  enteredPass: string
): Promise<{ 
  success: boolean; 
  token?: string;
  message?: string; 
  isLocked?: boolean; 
  remainingSeconds?: number;
  remainingAttempts?: number;
}> {
  try {
    const res = await fetch('/api/db/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: enteredUserOrEmail,
        password: enteredPass,
      }),
    });

    const data = await res.json();
    if (data.success && data.token) {
      setAdminToken(data.token);
    }

    return {
      success: !!data.success,
      token: data.token,
      message: data.message,
      isLocked: !!data.isLocked,
      remainingSeconds: data.remainingSeconds,
      remainingAttempts: data.remainingAttempts,
    };
  } catch (err: any) {
    console.error('Verification error:', err);
    return { success: false, message: err?.message || 'خطا در برقراری ارتباط با سرور پایگاه داده.' };
  }
}
