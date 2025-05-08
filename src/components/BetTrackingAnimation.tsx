
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Target } from "lucide-react";

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
  const [animationStage, setAnimationStage] = useState<"idle" | "shrinking" | "flying" | "impact" | "complete">("idle");
  const dartRef = useRef<HTMLDivElement>(null);
  const targetIconRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isActive && sourceRect && targetRect) {
      console.log("Animation triggered, preparing dart animation sequence");
      
      // Start with the shrinking animation
      setAnimationStage("shrinking");
      
      // After shrinking, start flying
      const flyTimer = setTimeout(() => {
        console.log("Dart formed, beginning flight");
        setAnimationStage("flying");
        
        // When flight completes, show impact
        const impactTimer = setTimeout(() => {
          console.log("Dart reached target, showing impact");
          setAnimationStage("impact");
          
          // Complete the animation
          const completeTimer = setTimeout(() => {
            console.log("Animation sequence complete");
            setAnimationStage("complete");
            onComplete();
          }, 800); // Impact animation duration
          
          return () => clearTimeout(completeTimer);
        }, 600); // Flight duration
        
        return () => clearTimeout(impactTimer);
      }, 600); // Shrinking duration
      
      return () => clearTimeout(flyTimer);
    } else if (!isActive) {
      setAnimationStage("idle");
    }
  }, [isActive, sourceRect, targetRect, onComplete]);
  
  if (!isActive || !sourceRect || !targetRect || animationStage === "complete") return null;
  
  // Calculate start position (center of source)
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  
  // Calculate end position (center of target)
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;
  
  // Calculate the angle for the dart to rotate during flight
  const angleRad = Math.atan2(endY - startY, endX - startX);
  const angleDeg = angleRad * (180 / Math.PI);
  
  // Determine variant-based styles
  const dartColor = variant === 'tail' ? 'bg-onetime-green' : 'bg-onetime-red';
  const dartGlow = variant === 'tail' ? 'shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'shadow-[0_0_15px_rgba(239,68,68,0.8)]';
  const targetStroke = variant === 'tail' ? 'stroke-onetime-green' : 'stroke-onetime-red';
  
  return createPortal(
    <>
      {/* The dart element */}
      <div
        ref={dartRef}
        className={`fixed pointer-events-none z-[100] transition-all ${
          animationStage === "shrinking" ? "duration-600" :
          animationStage === "flying" ? "duration-600" :
          "duration-300"
        }`}
        style={{
          // Shrinking stage - large circle that shrinks to a dart
          width: animationStage === "shrinking" ? 
            (100 - (100 * 0.8)) + 'px' : 
            animationStage === "flying" || animationStage === "impact" ? '20px' : '100px',
          height: animationStage === "shrinking" ? 
            (100 - (100 * 0.8)) + 'px' : 
            animationStage === "flying" || animationStage === "impact" ? '20px' : '100px',
          opacity: animationStage === "idle" ? 0 : 
                  animationStage === "impact" ? 0 : 1,
          transform: animationStage === "idle" ? `translate(${startX - 50}px, ${startY - 50}px)` :
                    animationStage === "shrinking" ? `translate(${startX - 10}px, ${startY - 10}px) rotate(${angleDeg}deg)` :
                    animationStage === "flying" ? `translate(${endX - 10}px, ${endY - 10}px) rotate(${angleDeg + 360}deg)` :
                    `translate(${endX - 10}px, ${endY - 10}px) rotate(${angleDeg + 360}deg) scale(0.5)`,
          // Customize the dart appearance
          borderRadius: animationStage === "shrinking" ? '50%' : '50% 50% 15% 50%', // Dart-like shape on flying
          backgroundColor: dartColor,
          boxShadow: animationStage === "flying" ? dartGlow : 'none',
          transition: animationStage === "flying" ? 
            'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 
            'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Dart fins - only visible during flying */}
        {animationStage === "flying" && (
          <div className="absolute top-1/2 left-0 w-5 h-3 transform -translate-y-1/2 -translate-x-2">
            <div className={`w-3 h-3 ${dartColor} transform rotate-45`}></div>
          </div>
        )}
      </div>
      
      {/* Target/dartboard that appears briefly at the portfolio icon */}
      {animationStage === "flying" && (
        <div 
          ref={targetIconRef}
          className="fixed pointer-events-none z-[99] transition-all duration-500"
          style={{
            width: '32px',
            height: '32px',
            opacity: animationStage === "flying" ? 1 : 0,
            transform: `translate(${endX - 16}px, ${endY - 16}px)`,
          }}
        >
          <Target 
            className={`w-full h-full ${targetStroke} animate-pulse-heartbeat`} 
            strokeWidth={2.5}
          />
        </div>
      )}
      
      {/* Impact effect */}
      {animationStage === "impact" && (
        <div 
          className="fixed pointer-events-none z-[101] transition-transform duration-300"
          style={{
            width: '40px',
            height: '40px',
            opacity: 0.8,
            transform: `translate(${endX - 20}px, ${endY - 20}px) scale(1.2)`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${variant === 'tail' ? '#10B981' : '#EF4444'} 0%, transparent 70%)`,
            animation: 'quick-flash 0.8s forwards'
          }}
        />
      )}
    </>,
    document.body
  );
};

export default BetTrackingAnimation;
