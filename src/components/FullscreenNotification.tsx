
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [textAppeared, setTextAppeared] = useState({
    headline: false,
    subheadline: false,
    message: false,
  });

  useEffect(() => {
    if (isOpen) {
      // Quick animation sequence for elements appearing
      setIsVisible(true);
      
      // Start animation sequence
      setTimeout(() => setShowConfetti(true), 100);
      setTimeout(() => setTextAppeared(prev => ({ ...prev, headline: true })), 300);
      setTimeout(() => setTextAppeared(prev => ({ ...prev, subheadline: true })), 800);
      setTimeout(() => setShowSparkles(true), 1000);
      setTimeout(() => setTextAppeared(prev => ({ ...prev, message: true })), 1300);
      
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setShowSparkles(false);
        setShowConfetti(false);
        setTextAppeared({ headline: false, subheadline: false, message: false });
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = () => {
    setShowSparkles(false);
    setShowConfetti(false);
    setTextAppeared({ headline: false, subheadline: false, message: false });
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) return null;

  const IconComponent = variant === "tail" ? ZapIcon : PartyPopper;
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
        } ${showConfetti ? "animate-subtle-shake" : ""}`}
        onClick={handleBackdropClick}
      ></div>
      
      {/* Notification card with enhanced animations */}
      <div
        className={`relative max-w-md w-full rounded-xl p-8 shadow-2xl text-center transform transition-all duration-500 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        } ${bgGradient} text-white overflow-hidden ${
          showConfetti ? "shadow-glow" : ""
        }`}
        style={{
          boxShadow: showConfetti ? 
            `0 0 30px ${variant === "tail" ? "rgba(16, 185, 129, 0.7)" : "rgba(239, 68, 68, 0.7)"}` : 
            "none"
        }}
      >
        {/* Close button */}
        <button
          onClick={handleBackdropClick}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors duration-300"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Background flash effect */}
        {showConfetti && (
          <div className="absolute inset-0 bg-white/20 animate-quick-flash pointer-events-none"></div>
        )}
        
        {/* Animated icon */}
        <div className={`text-center mb-6 transition-all duration-700 transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
        } ${showConfetti ? "animate-bounce-pop" : ""}`}>
          <IconComponent className="h-14 w-14 mx-auto text-white" />
        </div>
        
        {/* Headline with slide-in animation */}
        <div className={`overflow-hidden mb-2 h-12`}>
          <h2 
            className={`text-3xl font-extrabold transition-all duration-700 transform ${
              textAppeared.headline ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            You {variant === "tail" ? "tailed" : "faded"} @{bettorName}
          </h2>
        </div>
        
        {/* Subheadline with zoom animation */}
        <div className="overflow-hidden mb-6 h-10">
          <h3 
            className={`text-xl font-medium transition-all duration-700 transform ${
              textAppeared.subheadline ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            {betDescription}
          </h3>
        </div>
        
        <Separator className="bg-white/30 my-6" />
        
        {/* Message with fade-in and sparkle effects */}
        <div className="relative mt-6 h-10 flex items-center justify-center">
          {showSparkles && (
            <>
              <div className="absolute -top-2 -left-4">
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-0 -right-2">
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              </div>
            </>
          )}
          
          <p 
            className={`text-lg font-normal text-white transition-all duration-700 ${
              textAppeared.message ? "opacity-100" : "opacity-0"
            } ${textAppeared.message ? "animate-text-reveal" : ""}`}
          >
            {message}
          </p>
        </div>

        {/* Dynamic confetti/sparkle elements */}
        {showConfetti && (
          <>
            <div className="absolute top-[5%] left-[10%] animate-float-1">
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
            <div className="absolute top-[20%] right-[15%] animate-float-2">
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
            <div className="absolute bottom-[15%] left-[20%] animate-float-3">
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <div className="absolute bottom-[10%] right-[10%] animate-float-2">
              <Sparkles className="h-3 w-3 text-yellow-300" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FullscreenNotification;
