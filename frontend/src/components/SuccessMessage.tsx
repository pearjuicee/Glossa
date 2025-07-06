import React, { useEffect } from "react";

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
  duration?: number; // optional — no default
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
  duration,
}) => {
  useEffect(() => {
    if (!onClose || duration === undefined) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      <span>{message}</span>
      {onClose && (
        <button className="ml-4 text-sm underline" onClick={onClose}>
          Dismiss
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;
