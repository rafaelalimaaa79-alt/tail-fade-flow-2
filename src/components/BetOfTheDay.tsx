
import React, { useState, useRef, useEffect } from "react";
import WaveText from "./WaveText";
import PlayCard from "./PlayCard";
import PaginationIndicator from "./PaginationIndicator";
import { playsOfTheDay } from "@/types/betTypes";
import useWaveAnimation from "@/hooks/useWaveAnimation";

const BetOfTheDay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPlay = playsOfTheDay[currentIndex];
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const { animationPosition, activeLine } = useWaveAnimation();
  const isFade = currentPlay.suggestionType === "fade";
  
  // Render the wave text
  const renderWaveText = (text: string, lineIndex: number) => {
    return (
      <WaveText
        text={text}
        lineIndex={lineIndex}
        activeLine={activeLine}
        animationPosition={animationPosition}
        isFade={isFade}
      />
    );
  };

  // Handle next play
  const nextPlay = () => {
    setCurrentIndex((prev) => (prev + 1) % playsOfTheDay.length);
  };
  
  // Handle previous play
  const prevPlay = () => {
    setCurrentIndex((prev) => (prev === 0 ? playsOfTheDay.length - 1 : prev - 1));
  };
  
  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };
  
  const handleSwipe = () => {
    // Threshold for swipe detection (minimum 50px horizontal movement)
    const threshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) < threshold) return;
    
    if (diff > 0) {
      // Swipe left, go to next
      nextPlay();
    } else {
      // Swipe right, go to previous
      prevPlay();
    }
  };
  
  // Auto rotate through plays every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextPlay();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <PlayCard play={currentPlay} renderWaveText={renderWaveText} />
      <PaginationIndicator 
        currentIndex={currentIndex} 
        totalItems={playsOfTheDay.length} 
      />
    </div>
  );
};

export default BetOfTheDay;
