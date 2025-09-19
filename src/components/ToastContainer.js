// src/components/ToastContainer.js
"use client";
import React, { useState, useCallback } from 'react';
import Toast from './Toast';

export const ToastContext = React.createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type) => {
    setToasts(currentToasts => [
      ...currentToasts,
      { id: toastId++, message, type }
    ]);
  }, []);

  const removeToast = (id) => {
    setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type}
            onDone={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};