
import React from "react";
import FullscreenNotification from "@/components/FullscreenNotification";
import { useNotificationStore } from "@/utils/betting-notifications";

const TrendsNotificationHandler = () => {
  const { 
    isOpen, 
    message, 
    variant, 
    closeNotification, 
    bettorName, 
    betDescription
  } = useNotificationStore();
  
  return (
    <FullscreenNotification 
      isOpen={isOpen}
      message={message}
      variant={variant || "tail"}
      onClose={closeNotification}
      bettorName={bettorName}
      betDescription={betDescription}
    />
  );
};

export default TrendsNotificationHandler;
