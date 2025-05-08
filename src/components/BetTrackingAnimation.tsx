
import React from "react";

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
  // Simple component that doesn't render anything but calls onComplete
  // This is kept as a placeholder in case we want to add animations back later
  React.useEffect(() => {
    if (isActive) {
      // Just call onComplete immediately
      onComplete();
    }
  }, [isActive, onComplete]);
  
  return null;
};

export default BetTrackingAnimation;
