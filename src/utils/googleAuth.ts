// Google Identity Services (GIS) Helper Module for Google Login
// Client ID: 971965056909-tpoh260orks2v4sh1v3tnrhurtd2hfd3.apps.googleusercontent.com

export const GOOGLE_CLIENT_ID = '971965056909-tpoh260orks2v4sh1v3tnrhurtd2hfd3.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

export function loadGoogleIdentityServicesScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is undefined'));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      scriptLoadingPromise = null;
      reject(new Error('Failed to load Google Identity Services library'));
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export async function initGoogleSignIn(
  container: HTMLElement,
  onCredential: (credential: string) => void,
  isActive: () => boolean,
): Promise<void> {
  await loadGoogleIdentityServicesScript();
  if (!isActive()) return;
  const identity = window.google?.accounts?.id;
  if (!identity) throw new Error('Google Identity Services is unavailable.');

  identity.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: ({ credential }: { credential?: string }) => {
      if (credential && isActive()) onCredential(credential);
    },
    auto_select: false,
  });
  identity.renderButton(container, {
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    locale: 'fa',
  });
}
