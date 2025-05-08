
import React from "react";
import FullscreenNotification from "@/components/FullscreenNotification";
import BetTrackingAnimation from "@/components/BetTrackingAnimation";
import { useNotificationStore } from "@/utils/betting-notifications";

interface NotificationHandlerProps {
  getPortfolioRect: () => DOMRect | null;
}

const NotificationHandler = ({ getPortfolioRect }: NotificationHandlerProps) => {
  const { 
    isOpen, 
    message, 
    variant, 
    closeNotification, 
    bettorName, 
    betDescription,
    showFlyAnimation,
    sourceRect,
    completeFlyAnimation
  } = useNotificationStore();
  
  return (
    <>
      {/* Fullscreen notification component */}
      <FullscreenNotification 
        isOpen={isOpen}
        message={message}
        variant={variant || "tail"}
        onClose={closeNotification}
        bettorName={bettorName}
        betDescription={betDescription}
      />
      
      {/* Animation to show bet flying to portfolio */}
      <BetTrackingAnimation
        isActive={showFlyAnimation}
        onComplete={completeFlyAnimation}
        sourceRect={sourceRect}
        targetRect={getPortfolioRect()}
        variant={variant || "tail"}
      />
    </>
  );
};

export default NotificationHandler;
