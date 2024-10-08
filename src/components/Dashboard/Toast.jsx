import React, { useEffect, useRef } from 'react';

const Toast = ({ message, onDismiss, duration }) => {
  const progressBarRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      if (progressBarRef.current) {
        const newWidth = parseFloat(progressBarRef.current.style.width) - (100 / (duration / 100));
        if (newWidth <= 0) {
          onDismiss();
        } else {
          progressBarRef.current.style.width = `${newWidth}%`;
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onDismiss]);

  return (
    <div className="gap-4 relative flex items-center py-2 px-2 w-auto h-auto bg-gray-100 text-gray-500 border rounded-md shadow-lg mb-2 flex-col">
      <div className="flex gap-12">
        <div className="flex items-center justify-center">{message}</div>
      </div>
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all"
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default Toast;
