
import React, { useState, useEffect, useRef, ReactNode } from "react";

type PublicGameVisibilityWrapperProps = {
  children: (isVisible: boolean, isMostVisible: boolean) => ReactNode;
  isInitialized?: boolean;
};

const PublicGameVisibilityWrapper = ({ children, isInitialized = false }: PublicGameVisibilityWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMostVisible, setIsMostVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentItem = itemRef.current;
    if (!currentItem) return;

    // Create an intersection observer to detect when the item is visible
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // Use viewport as root
        rootMargin: "0px",
        threshold: 0.1, // Item is considered visible with just 10% showing
      }
    );
    
    // Start observing this item
    visibilityObserver.observe(currentItem);
    
    // Create a function that checks which visible public game item is most centered
    const checkMostCentered = () => {
      // Only proceed if this item is visible
      if (!isVisible || !currentItem) {
        setIsMostVisible(false);
        return;
      }
      
      // Get all public game items
      const allPublicGameItems = document.querySelectorAll('.public-game-item');
      
      // Calculate the center of the viewport
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      let closestItem = null;
      let closestDistance = Infinity;
      
      // Find which item's center is closest to viewport center
      allPublicGameItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distanceToCenter = Math.abs(itemCenter - viewportCenter);
        
        if (distanceToCenter < closestDistance) {
          closestDistance = distanceToCenter;
          closestItem = item;
        }
      });
      
      // Check if this item is the closest
      setIsMostVisible(closestItem === currentItem);
    };
    
    // Check on scroll and resize
    window.addEventListener('scroll', checkMostCentered);
    window.addEventListener('resize', checkMostCentered);
    
    // Initial check
    setTimeout(checkMostCentered, 100);
    
    return () => {
      // Clean up
      if (currentItem) {
        visibilityObserver.unobserve(currentItem);
      }
      window.removeEventListener('scroll', checkMostCentered);
      window.removeEventListener('resize', checkMostCentered);
    };
  }, [isVisible]);
  
  return (
    <div ref={itemRef} className="public-game-item">
      {children(isVisible, isMostVisible)}
    </div>
  );
};

export default PublicGameVisibilityWrapper;
