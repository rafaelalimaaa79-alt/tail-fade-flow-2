
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
        
        // Complete animation after 600ms
        const completionTimer = setTimeout(() => {
          setAnimationActive(false);
          onComplete();
        }, 600);
        
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
  const glowColor = variant === 'tail' ? 'shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'shadow-[0_0_15px_rgba(239,68,68,0.8)]';
  
  return createPortal(
    <div
      ref={animationRef}
      className={`fixed pointer-events-none z-[100] ${backgroundColor} rounded-full transition-all duration-600 ease-out ${animationActive ? glowColor : ''}`}
      style={{
        width: animationActive ? '12px' : '40px',
        height: animationActive ? '12px' : '40px',
        opacity: animationActive ? 0.9 : 0,
        transform: animationActive 
          ? `translate(${endX - 6}px, ${endY - 6}px) scale(0.5)`
          : `translate(${startX - 20}px, ${startY - 20}px) scale(1)`,
      }}
    />,
    document.body
  );
};

export default BetTrackingAnimation;
