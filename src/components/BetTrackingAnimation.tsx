
import React from "react";
import { useNavigate } from "react-router-dom";

interface BetTrackingAnimationProps {
  isActive: boolean;
  onComplete: () => void;
  sourceRect?: DOMRect | null;
  targetRect?: DOMRect | null;
  variant: "tail" | "fade";
}

const BetTrackingAnimation = ({
  isActive,
  onComplete,
}: BetTrackingAnimationProps) => {
  const navigate = useNavigate();
  
  // When active, immediately redirect to profile page and mark as complete
  React.useEffect(() => {
    if (isActive) {
      // Call onComplete to handle state changes
      onComplete();
      
      // Redirect to profile page after a brief delay
      const timer = setTimeout(() => {
        navigate('/profile');
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete, navigate]);
  
  return null;
};

export default BetTrackingAnimation;
