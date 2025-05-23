
import { useState, useEffect, useRef, useCallback } from "react";

interface WaveAnimationOptions {
  totalDuration?: number;
  lineChangePoint?: number;
  pauseDuration?: number;
}

const useWaveAnimation = ({
  totalDuration = 1500, // Reduced from 2000ms to 1500ms (25% faster)
  lineChangePoint = 0.5,
  pauseDuration = 200  // Reduced from 300ms to 200ms
}: WaveAnimationOptions = {}) => {
  const [animationPosition, setAnimationPosition] = useState(0);
  const [activeLine, setActiveLine] = useState(0);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  
  // Define animate function with useCallback to prevent unnecessary recreations
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    
    // Calculate total progress (0 to 1)
    const totalProgress = Math.min(elapsed / totalDuration, 1);
    
    // Calculate wave position (0 to 1, then 0 to 1 again)
    if (totalProgress < lineChangePoint) {
      // First line animation
      setActiveLine(0);
      setAnimationPosition(totalProgress / lineChangePoint);
    } else {
      // Second line animation
      setActiveLine(1);
      setAnimationPosition((totalProgress - lineChangePoint) / (1 - lineChangePoint));
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
