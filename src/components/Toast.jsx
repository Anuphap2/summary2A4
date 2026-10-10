import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="no-print fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className={`px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 border text-xs font-semibold ${
        isSuccess 
          ? 'bg-neutral-900 text-white border-neutral-700' 
          : isError 
            ? 'bg-rose-900 text-white border-rose-700' 
            : 'bg-white text-neutral-900 border-neutral-300'
      }`}>
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
        <span>{toast.message}</span>
        <button 
          onClick={onClose}
          className="ml-2 opacity-60 hover:opacity-100 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
