
import React, { useState, useEffect } from "react";
import { ZapIcon } from "lucide-react";

type FullscreenNotificationProps = {
  message: string;
  isOpen: boolean;
  variant: "tail" | "fade";
  onClose: () => void;
  bettorName: string;
  betDescription: string;
};

const FullscreenNotification = ({
  isOpen,
  variant,
  onClose,
  bettorName,
  betDescription,
}: FullscreenNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [textAppeared, setTextAppeared] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Quick animation sequence for elements appearing
      setIsVisible(true);
      
      // Start animation sequence
      setTimeout(() => setTextAppeared(true), 300);
      
      // Auto-close after 2.5 seconds to get to the fly animation faster
      const timer = setTimeout(() => {
        setTextAppeared(false);
        
        // Shorter fade out to make transition to fly animation more immediate
        setTimeout(() => {
          setIsVisible(false);
          // Call onClose sooner for a quicker transition to the fly animation
          setTimeout(onClose, 300);
        }, 200);
      }, 2500);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = () => {
    setTextAppeared(false);
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) return null;

  const IconComponent = variant === "tail" ? ZapIcon : ZapIcon;
  const bgGradient = variant === "tail" 
    ? "bg-gradient-to-br from-onetime-green/95 to-onetime-green/80" 
    : "bg-gradient-to-br from-onetime-red/95 to-onetime-red/80";

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background overlay with blur effect and animated burst */}
      <div 
        className={`absolute inset-0 backdrop-blur-md transition-all duration-700 ${
          isVisible ? "bg-black/80" : "bg-black/0"
        } ${isVisible ? "animate-subtle-shake" : ""}`}
        onClick={handleBackdropClick}
      ></div>
      
      {/* Notification card with enhanced animations */}
      <div
        className={`relative max-w-md w-full rounded-xl p-8 shadow-2xl text-center transform transition-all duration-500 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        } ${bgGradient} text-white overflow-hidden ${
          isVisible ? "shadow-glow" : ""
        }`}
        style={{
          boxShadow: isVisible ? 
            `0 0 30px ${variant === "tail" ? "rgba(16, 185, 129, 0.7)" : "rgba(239, 68, 68, 0.7)"}` : 
            "none"
        }}
      >
        {/* Background flash effect */}
        {isVisible && (
          <div className="absolute inset-0 bg-white/20 animate-quick-flash pointer-events-none"></div>
        )}
        
        {/* App logo positioned at top left */}
        <div className="absolute top-4 left-4">
          <img 
            src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
            alt="ONE TIME logo" 
            className="h-16 w-16 transition-all duration-700 transform"
          />
        </div>
        
        {/* Centered content div that contains all text */}
        <div className="flex flex-col items-center justify-center h-full py-6">
          {/* Main notification text */}
          <div className={`overflow-hidden mb-2`}>
            <h2 
              className={`text-4xl font-bold transition-all duration-700 transform ${
                textAppeared ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
            >
              You {variant === "tail" ? "tailed" : "faded"} @{bettorName}'s
            </h2>
          </div>
          
          {/* Bet description */}
          <div className="overflow-hidden mt-4">
            <h3 
              className={`text-3xl font-semibold transition-all duration-700 transform ${
                textAppeared ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              {betDescription}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenNotification;
