import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-vara-rose text-white px-5 py-3.5 rounded-xl shadow-vara-float border border-vara-rose animate-fadeIn">
      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
      <span className="text-xs font-medium font-vazir">{message}</span>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-white/15 rounded-full transition-colors text-white/80 hover:text-white mr-1 cursor-pointer"
        aria-label="بستن"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
