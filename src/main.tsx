import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against unhandled fetch / AbortController cancellations and IndexedDB closing events in iframes/background tabs
if (typeof window !== 'undefined') {
  const isIgnorableError = (msg?: string, name?: string) => {
    if (!msg && !name) return false;
    const text = `${name || ''} ${msg || ''}`.toLowerCase();
    return (
      text.includes('database is closing') ||
      text.includes('closing/hidden') ||
      text.includes('aborterror') ||
      text.includes('signal is aborted') ||
      text.includes('aborted without reason') ||
      text.includes('connection is closing') ||
      text.includes('failed to fetch') ||
      text.includes('network request failed')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || (typeof event.reason === 'string' ? event.reason : '');
    const name = event.reason?.name || '';
    if (isIgnorableError(msg, name)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || (typeof event.error?.message === 'string' ? event.error.message : '');
    const name = event.error?.name || '';
    if (isIgnorableError(msg, name)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
