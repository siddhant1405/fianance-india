import React, { createContext, useState, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiInfo, FiAlertCircle } from 'react-icons/fi';

const ToastContext = createContext(null);

let toastId = 0;

const ICONS = {
  success: <FiCheck className="w-4 h-4" />,
  error:   <FiAlertCircle className="w-4 h-4" />,
  info:    <FiInfo className="w-4 h-4" />,
};

const COLORS = {
  success: 'border-gain bg-gain/10 text-gain',
  error:   'border-loss bg-loss/10 text-loss',
  info:    'border-accent bg-accent/10 text-accent',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-lg shadow-elevated text-sm font-medium ${COLORS[toast.type]}`}
            >
              <span className="flex-shrink-0">{ICONS[toast.type]}</span>
              <span className="text-txt-primary">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 ml-2 text-txt-muted hover:text-txt-primary transition-colors"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
