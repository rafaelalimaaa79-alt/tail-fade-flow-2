
import React, { useState, useEffect } from "react";
import { ZapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FullscreenNotificationProps = {
  message: string;
  isOpen: boolean;
  variant: "tail" | "fade" | "email-verification";
  onClose: () => void;
  bettorName: string;
  betDescription: string;
  autoCloseAfter?: number;
};

const FullscreenNotification = ({
  message,
  isOpen,
  variant,
  onClose,
  bettorName,
  betDescription,
  autoCloseAfter = 0,
}: FullscreenNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [textAppeared, setTextAppeared] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      console.log("Fullscreen notification opening");
      setIsVisible(true);
      
      // Start animation sequence
      setTimeout(() => setTextAppeared(true), 300);
      
      // Auto-close after specified time if provided
      if (autoCloseAfter > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseAfter);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoCloseAfter]);

  const handleClose = () => {
    console.log("Closing notification");
    setTextAppeared(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 400);
  };

  const handleBackdropClick = () => {
    // Don't allow closing email verification notification by clicking backdrop
    if (variant === "email-verification") {
      console.log("Email verification notification - cannot close by clicking backdrop");
      return;
    }
    console.log("Backdrop clicked, closing notification");
    handleClose();
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
    : variant === "email-verification"
    ? "bg-gradient-to-br from-yellow-500/95 to-orange-500/80"
    : "bg-gradient-to-br from-[#AEE3F5]/95 to-[#AEE3F5]/80";

  // Check if this is a welcome message or email verification
  const isWelcomeMessage = message.includes("YOU'RE IN!");
  const isEmailVerification = variant === "email-verification";

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
        } ${bgGradient} text-black overflow-hidden ${
          isVisible ? "shadow-glow" : ""
        }`}
        style={{
          boxShadow: isVisible ? 
            `0 0 30px ${variant === "tail" ? "rgba(16, 185, 129, 0.7)" : "rgba(174, 227, 245, 0.7)"}` : 
            "none"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Centered content div that contains all text */}
        <div className="flex flex-col items-center justify-center h-full py-6">
          {isWelcomeMessage ? (
            <>
              {/* Welcome message */}
              <div className={`overflow-hidden mb-2`}>
                <h2
                  className={`text-4xl font-bold transition-all duration-700 transform ${
                    textAppeared ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  YOU'RE IN!
                </h2>
              </div>

              {/* Username welcome */}
              <div className="overflow-hidden mt-4">
                <h3
                  className={`text-3xl font-semibold transition-all duration-700 transform ${
                    textAppeared ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                >
                  Welcome @{bettorName}!
                </h3>
              </div>
            </>
          ) : isEmailVerification ? (
            <>
              {/* Email Verification message */}
              <div className={`overflow-hidden mb-2`}>
                <h2
                  className={`text-4xl font-bold transition-all duration-700 transform ${
                    textAppeared ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  {message}
                </h2>
              </div>

              {/* Email address */}
              <div className="overflow-hidden mt-4">
                <h3
                  className={`text-2xl font-semibold transition-all duration-700 transform ${
                    textAppeared ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                >
                  {bettorName}
                </h3>
              </div>

              {/* Instructions */}
              <div className="overflow-hidden mt-6">
                <p
                  className={`text-lg text-center px-4 transition-all duration-700 transform ${
                    textAppeared ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  {betDescription}
                </p>
              </div>

              {/* Checking status indicator */}
              <div className="overflow-hidden mt-8">
                <div
                  className={`flex items-center gap-2 transition-all duration-700 transform ${
                    textAppeared ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  <span className="text-sm font-medium">Checking verification status...</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Regular tail/fade message */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullscreenNotification;
