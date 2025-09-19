// src/components/Toast.js
"use client";
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Toast = ({ message, type, onDone }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
      // Wait for animation to finish before removing the toast
      setTimeout(onDone, 500); 
    }, 2000);

    return () => clearTimeout(exitTimer);
  }, [onDone]);

  const isSuccess = type === 'success';
  const Icon = isSuccess ? FaCheckCircle : FaTimesCircle;
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  // Pastikan animasi berjalan dengan Tailwind dan keyframes custom
  const animationClass = exiting ? 'toast-slide-out' : 'toast-slide-in';

  return (
    <div 
      className={`fixed top-5 right-5 ${bgColor} text-white py-2 px-4 rounded-lg shadow-lg flex items-center z-50 ${animationClass}`}
      style={{ transition: 'transform 0.5s, opacity 0.5s' }}
    >
      <Icon className="mr-3 text-xl" />
      <div className="flex-1">
        <p className="font-bold">{isSuccess ? 'Success' : 'Error'}</p>
        <p>{message}</p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/50 overflow-hidden">
        <div
          className="h-full bg-white toast-progress"
          style={{
            transform: exiting ? 'translateX(0)' : 'translateX(100%)',
            animation: exiting ? undefined : 'toast-progress 2s linear forwards',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Toast;