
import { useState, useEffect, useRef } from "react";

const useWaveAnimation = () => {
  const [animationPosition, setAnimationPosition] = useState(0);
  const [activeLine, setActiveLine] = useState(0);
  
  // Animation effect
  useEffect(() => {
    let animationFrame: number;
    let startTime: number | null = null;
    const totalDuration = 3000; // Total animation time in ms
    const lineChangePoint = 0.5; // When to switch lines (0.5 = halfway)
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate total progress (0 to 1)
      const totalProgress = Math.min(elapsed / totalDuration, 1);
      
      // Calculate wave position (0 to 1, then 0 to 1 again)
      // We want the wave to move from left to right across each line
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
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Reset and restart animation after completion
        setTimeout(() => {
          setAnimationPosition(0);
          setActiveLine(0);
          startTime = null;
          animationFrame = requestAnimationFrame(animate);
        }, 300); // Small pause between animation cycles
      }
    };
    
    // Start the animation
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return { animationPosition, activeLine };
};

export default useWaveAnimation;
