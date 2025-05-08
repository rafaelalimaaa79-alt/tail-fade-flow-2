
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
      // Start immediately after notification closes
      console.log("Animation triggered, preparing to animate");
      
      // Immediate start with a very slight delay for visual continuity
      const timer = setTimeout(() => {
        console.log("Starting animation");
        setAnimationActive(true);
        
        // Animation duration matches the CSS transition duration
        const completionTimer = setTimeout(() => {
          console.log("Animation complete");
          setAnimationActive(false);
          onComplete();
        }, 800); // Slightly longer for a more visible effect
        
        return () => clearTimeout(completionTimer);
      }, 50); // Minimal delay
      
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
  const glowColor = variant === 'tail' ? 'shadow-[0_0_20px_rgba(16,185,129,0.9)]' : 'shadow-[0_0_20px_rgba(239,68,68,0.9)]';
  
  return createPortal(
    <div
      ref={animationRef}
      className={`fixed pointer-events-none z-[100] ${backgroundColor} rounded-full transition-all duration-800 ease-out ${animationActive ? glowColor : ''}`}
      style={{
        width: animationActive ? '16px' : '60px', // Larger for better visibility
        height: animationActive ? '16px' : '60px',
        opacity: animationActive ? 1 : 0,
        transform: animationActive 
          ? `translate(${endX - 8}px, ${endY - 8}px) scale(0.5)`
          : `translate(${startX - 30}px, ${startY - 30}px) scale(1)`,
      }}
    />,
    document.body
  );
};

export default BetTrackingAnimation;
