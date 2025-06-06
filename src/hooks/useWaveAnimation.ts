
import { useState, useEffect, useRef, useCallback } from "react";

interface WaveAnimationOptions {
  totalDuration?: number;
  lineChangePoint?: number;
  pauseDuration?: number;
}

const useWaveAnimation = ({
  totalDuration = 4000, // 2 seconds per line = 4 seconds total
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
    
    // Throttle updates for smoother performance
    if (timestamp - lastUpdateRef.current < 16) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    lastUpdateRef.current = timestamp;
    
    const elapsed = timestamp - startTimeRef.current;
    
    // Calculate total progress (0 to 1)
    const totalProgress = Math.min(elapsed / totalDuration, 1);
    
    // Linear movement for constant speed across each line
    if (totalProgress < lineChangePoint) {
      // First line: 2 seconds (0 to 0.5 of total time)
      setActiveLine(0);
      const lineProgress = totalProgress / lineChangePoint; // 0 to 1
      setAnimationPosition(lineProgress); // Linear sweep from 0 to 1
    } else {
      // Second line: 2 seconds (0.5 to 1.0 of total time)
      setActiveLine(1);
      const lineProgress = (totalProgress - lineChangePoint) / (1 - lineChangePoint); // 0 to 1
      setAnimationPosition(lineProgress); // Linear sweep from 0 to 1
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
