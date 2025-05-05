
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type FullscreenNotificationProps = {
  message: string;
  isOpen: boolean;
  variant: "tail" | "fade";
  onClose: () => void;
  bettorName: string;
  betDescription: string;
};

const FullscreenNotification = ({
  message,
  isOpen,
  variant,
  onClose,
  bettorName,
  betDescription,
}: FullscreenNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Close after fade animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/80" onClick={onClose}></div>
      <div
        className={`relative max-w-md w-full rounded-xl p-8 shadow-2xl text-center transform transition-all ${
          isVisible ? "scale-100" : "scale-95"
        } ${
          variant === "tail"
            ? "bg-onetime-green/95 text-white"
            : "bg-onetime-red/95 text-white"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Headline */}
        <h2 className="text-2xl font-extrabold mb-2">
          You {variant === "tail" ? "tailed" : "faded"} @{bettorName}
        </h2>
        
        {/* Subheadline */}
        <h3 className="text-xl font-medium mb-4">
          {betDescription}
        </h3>
        
        <Separator className="bg-white/30 my-4" />
        
        {/* Message */}
        <p className="text-lg font-normal text-white/90 mt-4">
          {message}
        </p>
      </div>
    </div>
  );
};

export default FullscreenNotification;
