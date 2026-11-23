import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#8C3B58] text-white px-5 py-3.5 rounded-xl shadow-[0_12px_32px_-8px_rgba(140,59,88,0.3)] border border-[#732E47] animate-fadeIn">
      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
      <span className="text-xs font-medium font-vazir">{message}</span>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-white/15 rounded-lg transition-colors text-white/80 hover:text-white mr-1 cursor-pointer"
        aria-label="بستن"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
