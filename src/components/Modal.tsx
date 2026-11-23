import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  label: string;
  onClose: () => void;
  className: string;
  children: ReactNode;
}

const focusable = 'button:not(:disabled), a[href], input:not(:disabled):not([type=hidden]), select:not(:disabled), textarea:not(:disabled), summary, [tabindex="0"]';

export function Modal({ label, onClose, className, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const trigger = document.activeElement;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-initial-focus], [aria-label^="بستن"]')?.focus();
    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      aria-label={label}
      dir="rtl"
      className={`vara-modal ${className}`}
      onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={(event: KeyboardEvent<HTMLDialogElement>) => {
        event.stopPropagation();
        if (event.key !== 'Tab' || event.defaultPrevented) return;
        const controls = Array.from((event.currentTarget as HTMLDialogElement).querySelectorAll<HTMLElement>(focusable))
          .filter((element) => element.tabIndex >= 0 && element.getClientRects().length && !element.closest('[inert]'));
        const target = document.activeElement;
        const next = event.shiftKey
          ? target === controls[0] || !controls.includes(target as HTMLElement) ? controls.at(-1) : undefined
          : target === controls.at(-1) || !controls.includes(target as HTMLElement) ? controls[0] : undefined;
        if (next) {
          event.preventDefault();
          next.focus();
        }
      }}
    >
      {children}
    </dialog>,
    document.body
  );
}
