
import { useState, useEffect, useRef, useCallback } from "react";

interface WaveAnimationOptions {
  totalDuration?: number;
  lineChangePoint?: number;
  pauseDuration?: number;
}

const useWaveAnimation = ({
  totalDuration = 4000, // Keep the current 4 second duration
  lineChangePoint = 0.5,
  pauseDuration = 200
}: WaveAnimationOptions = {}) => {
  const [animationPosition, setAnimationPosition] = useState(0);
  const [activeLine, setActiveLine] = useState(0);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  // Define animate function with useCallback to prevent unnecessary recreations
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    
    // Throttle updates to ~60fps for smoother performance
    if (timestamp - lastUpdateRef.current < 16) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    lastUpdateRef.current = timestamp;
    
    const elapsed = timestamp - startTimeRef.current;
    
    // Calculate total progress (0 to 1) with smoother easing
    const totalProgress = Math.min(elapsed / totalDuration, 1);
    
    // Apply smooth easing function for more natural movement
    const easeInOutQuart = (t: number) => {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    };
    
    // Calculate wave position (0 to 1, then 0 to 1 again)
    if (totalProgress < lineChangePoint) {
      // First line animation
      setActiveLine(0);
      const lineProgress = totalProgress / lineChangePoint;
      setAnimationPosition(easeInOutQuart(lineProgress));
    } else {
      // Second line animation
      setActiveLine(1);
      const lineProgress = (totalProgress - lineChangePoint) / (1 - lineChangePoint);
      setAnimationPosition(easeInOutQuart(lineProgress));
    }
    
    // Continue animation if not complete
    if (totalProgress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Reset and restart animation after completion
      setTimeout(() => {
        setAnimationPosition(0);
        setActiveLine(0);
        startTimeRef.current = null;
        lastUpdateRef.current = 0;
        animationRef.current = requestAnimationFrame(animate);
      }, pauseDuration);
    }
  }, [totalDuration, lineChangePoint, pauseDuration]);
  
  // Start and clean up animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return { animationPosition, activeLine };
};

export default useWaveAnimation;
