import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

interface ToastProps {
  id: string;
  type: "error" | "success" | "info";
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/30",
          border: "border-red-200 dark:border-red-800/50",
          text: "text-red-800 dark:text-red-200",
          icon: <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
        };
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/30",
          border: "border-green-200 dark:border-green-800/50",
          text: "text-green-800 dark:text-green-200",
          icon: <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
        };
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/30",
          border: "border-blue-200 dark:border-blue-800/50",
          text: "text-blue-800 dark:text-blue-200",
          icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-md animate-in slide-in-from-top-2 duration-300 ${styles.text}`}
      role="alert"
    >
      {styles.icon}
      <div className="flex-1">
        <p className="font-semibold text-sm">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
