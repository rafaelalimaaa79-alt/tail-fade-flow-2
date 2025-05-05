
import React, { useState, useEffect } from "react";
import { X, Sparkles, ZapIcon, PartyPopper } from "lucide-react";
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
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      // Show sparkle effects after a short delay
      setTimeout(() => setShowSparkles(true), 300);
      
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setShowSparkles(false);
        setIsVisible(false);
        setTimeout(onClose, 500); // Close after fade animation
      }, 3000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const IconComponent = variant === "tail" ? ZapIcon : PartyPopper;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background overlay with blur effect */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Notification card */}
      <div
        className={`relative max-w-md w-full rounded-xl p-8 shadow-2xl text-center transform transition-all duration-500 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        } ${
          variant === "tail"
            ? "bg-gradient-to-br from-onetime-green/95 to-onetime-green/80 text-white"
            : "bg-gradient-to-br from-onetime-red/95 to-onetime-red/80 text-white"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors duration-300"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Fun icon animation */}
        <div className={`text-center mb-4 transition-all duration-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <IconComponent className="h-12 w-12 mx-auto text-white animate-bounce" />
        </div>
        
        {/* Headline with staggered animation */}
        <h2 className="text-2xl font-extrabold mb-2 animate-fade-in">
          You {variant === "tail" ? "tailed" : "faded"} @{bettorName}
        </h2>
        
        {/* Subheadline */}
        <h3 className="text-xl font-medium mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {betDescription}
        </h3>
        
        <Separator className="bg-white/30 my-4" />
        
        {/* Message with sparkles */}
        <div className="relative mt-4">
          {showSparkles && (
            <div className="absolute -top-2 -left-2">
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            </div>
          )}
          <p className="text-lg font-normal text-white mt-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {message}
          </p>
          {showSparkles && (
            <div className="absolute -bottom-2 -right-2">
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            </div>
          )}
        </div>

        {/* Decorative sparkles around the card */}
        {showSparkles && (
          <>
            <div className="absolute top-[10%] left-[-15px] animate-bounce" style={{ animationDuration: "2s" }}>
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
            <div className="absolute top-[30%] right-[-15px] animate-bounce" style={{ animationDuration: "1.5s", animationDelay: "0.5s" }}>
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
            <div className="absolute bottom-[20%] left-[-15px] animate-bounce" style={{ animationDuration: "1.8s", animationDelay: "0.3s" }}>
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FullscreenNotification;
