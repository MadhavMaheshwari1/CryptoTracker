// ToastContext.js
import React, { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message) => {
    const newToast = {
      id: Date.now(),
      message,
    };

    setToasts((prev) => [...prev, newToast]);

    // Automatically dismiss the toast after 5 seconds
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 5000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContext};

