import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import type { Toast as ToastType } from '../../store/toastStore';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-indigo-500" />,
};

const bgColors = {
  success: 'bg-emerald-50/90 border-emerald-100',
  error: 'bg-rose-50/90 border-rose-100',
  warning: 'bg-amber-50/90 border-amber-100',
  info: 'bg-indigo-50/90 border-indigo-100',
};

// Global Toast Container
export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Single Toast Card
const ToastItem = ({ toast, onClose }: { toast: ToastType; onClose: (id: string) => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 p-4 rounded-xl border shadow-md glassmorphism pointer-events-auto ${bgColors[toast.type]}`}
    >
      <span>{icons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium text-slate-800">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
