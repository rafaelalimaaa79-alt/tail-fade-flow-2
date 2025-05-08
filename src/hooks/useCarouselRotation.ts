
import { useState, useRef, useEffect } from "react";

interface CarouselRotationOptions {
  itemsCount: number;
  rotationInterval: number;
  pauseDuration?: number;
}

export const useCarouselRotation = ({ 
  itemsCount, 
  rotationInterval, 
  pauseDuration = 8000 
}: CarouselRotationOptions) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const rotationRef = useRef<NodeJS.Timeout | null>(null);
  const rotationPausedRef = useRef(false);
  
  // Setup carousel auto-rotation
  const setupAutoRotation = () => {
    // Clear any existing interval first
    if (rotationRef.current) {
      clearInterval(rotationRef.current);
    }
    
    // Set up a new interval
    rotationRef.current = setInterval(() => {
      if (!rotationPausedRef.current) {
        setCurrentIndex(prevIndex => (prevIndex + 1) % itemsCount);
      }
    }, rotationInterval);
  };
  
  // Set up the auto-rotation on component mount
  useEffect(() => {
    setupAutoRotation();
    
    return () => {
      if (rotationRef.current) {
        clearInterval(rotationRef.current);
      }
    };
  }, [itemsCount, rotationInterval]);
  
  // This function will handle the carousel changes
  const handleCarouselChange = (index: number) => {
    // Pause auto-rotation temporarily when user interacts
    rotationPausedRef.current = true;
    
    setCurrentIndex(index);
    
    // Resume auto-rotation after a delay
    setTimeout(() => {
      rotationPausedRef.current = false;
      setupAutoRotation();
    }, pauseDuration);
  };
  
  return {
    currentIndex,
    handleCarouselChange
  };
};
