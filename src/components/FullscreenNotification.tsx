
import React, { useState, useEffect } from "react";
import { ZapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Quick animation sequence for elements appearing
      console.log("Fullscreen notification opening");
      setIsVisible(true);
      
      // Start animation sequence
      setTimeout(() => setTextAppeared(true), 300);
      
      // Remove the automatic timeout - notification will stay until user clicks
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = () => {
    console.log("Backdrop clicked, closing notification");
    setTextAppeared(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 400);
  };

  const handleViewAllBets = () => {
    console.log("Navigating to profile page");
    onClose();
    navigate("/profile");
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
      onClick={handleBackdropClick}
    >
      {/* Background overlay with blur effect */}
      <div 
        className={`absolute inset-0 backdrop-blur-md transition-all duration-700 ${
          isVisible ? "bg-black/80" : "bg-black/0"
        }`}
      ></div>
      
      {/* Notification card with animations */}
      <div
        className={`relative max-w-md w-full rounded-xl p-8 shadow-2xl text-center transform transition-all ${
          isVisible ? "duration-500 scale-100 translate-y-0" : "duration-300 scale-95 translate-y-8"
        } ${bgGradient} text-white overflow-hidden ${
          isVisible ? "shadow-glow" : ""
        }`}
        style={{
          boxShadow: isVisible ? 
            `0 0 30px ${variant === "tail" ? "rgba(16, 185, 129, 0.7)" : "rgba(239, 68, 68, 0.7)"}` : 
            "none"
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on the card from closing the notification
      >
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
          
          {/* View all bets link at the bottom */}
          <div className="overflow-hidden mt-6">
            <button
              onClick={handleViewAllBets}
              className={`text-lg font-medium underline transition-all duration-700 transform hover:opacity-80 ${
                textAppeared ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
            >
              Click here to view all bets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenNotification;
