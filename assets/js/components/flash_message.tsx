import React, { useEffect, useState } from "react";
import { AlertCircle, Info, XCircle, AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription } from "../components/alert";

const FlashMessage = ({
  type = "info",
  message,
  className = "",
  duration = 3000,
  autoDissmiss = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const variants = {
    error: {
      icon: XCircle,
      className: "border-red-500 bg-red-50 text-red-900",
      iconClassName: "text-red-500",
      progressClassName: "bg-red-500",
    },
    warning: {
      icon: AlertTriangle,
      className: "border-yellow-500 bg-yellow-50 text-yellow-900",
      iconClassName: "text-yellow-500",
      progressClassName: "bg-yellow-500",
    },
    info: {
      icon: Info,
      className: "border-blue-500 bg-blue-50 text-blue-900",
      iconClassName: "text-blue-500",
      progressClassName: "bg-blue-500",
    },
    success: {
      icon: AlertCircle,
      className: "border-green-500 bg-green-50 text-green-900",
      iconClassName: "text-green-500",
      progressClassName: "bg-green-500",
    },
  };

  useEffect(() => {
    let dismissTimeout;

    if (autoDissmiss && isVisible) {
      dismissTimeout = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(dismissTimeout);
    };
  }, [isVisible, duration, autoDissmiss]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation to complete before unmounting
    setTimeout(() => {
      setShouldRender(false);
    }, 300); // Match this with transition duration
  };

  if (!shouldRender) return null;

  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div
      className={`
      transform transition-all duration-300 ease-in-out
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
    `}
    >
      <Alert
        className={`
        relative flex items-center p-4 mb-4 overflow-hidden
        ${variant.className} ${className}
      `}
      >
        <Icon className={`h-5 w-5 ${variant.iconClassName}`} />
        <AlertDescription className="ml-3 text-sm font-medium">
          {message}
        </AlertDescription>
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </Alert>
    </div>
  );
};

export default FlashMessage;
