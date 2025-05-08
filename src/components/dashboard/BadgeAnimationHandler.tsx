
import { useEffect } from "react";
import { usePortfolioStore } from "@/utils/portfolio-state";

const BadgeAnimationHandler = () => {
  const { showBadgeAnimation, resetBadgeAnimation } = usePortfolioStore();
  
  // Reset badge animation effect after it plays
  useEffect(() => {
    if (showBadgeAnimation) {
      const timer = setTimeout(() => {
        resetBadgeAnimation();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showBadgeAnimation, resetBadgeAnimation]);
  
  // This is a functional component with no UI
  return null;
};

export default BadgeAnimationHandler;
