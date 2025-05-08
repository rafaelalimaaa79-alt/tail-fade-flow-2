
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

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
  sourceRect,
  targetRect,
  variant
}: BetTrackingAnimationProps) => {
  const [animationActive, setAnimationActive] = useState(false);
  const animationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isActive && sourceRect && targetRect) {
      // Delay to let the notification finish first
      const timer = setTimeout(() => {
        setAnimationActive(true);
        
        // Complete animation after 500ms
        const completionTimer = setTimeout(() => {
          setAnimationActive(false);
          onComplete();
        }, 500);
        
        return () => clearTimeout(completionTimer);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, sourceRect, targetRect, onComplete]);
  
  if (!isActive || !sourceRect || !targetRect) return null;
  
  // Calculate start position (center of source)
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  
  // Calculate end position (center of target)
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;
  
  const backgroundColor = variant === 'tail' ? 'bg-onetime-green' : 'bg-onetime-red';
  
  return createPortal(
    <div
      ref={animationRef}
      className={`fixed pointer-events-none z-[100] ${backgroundColor} rounded-full shadow-lg transition-all duration-500 ease-out`}
      style={{
        width: animationActive ? '16px' : '40px',
        height: animationActive ? '16px' : '40px',
        opacity: animationActive ? 0.8 : 0,
        transform: animationActive 
          ? `translate(${endX - 8}px, ${endY - 8}px) scale(0.5)`
          : `translate(${startX - 20}px, ${startY - 20}px) scale(1)`,
      }}
    />,
    document.body
  );
};

export default BetTrackingAnimation;
