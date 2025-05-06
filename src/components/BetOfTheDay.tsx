
import React, { useState, useRef, useEffect } from "react";
import WaveText from "./WaveText";
import PlayCard from "./PlayCard";
import PaginationIndicator from "./PaginationIndicator";
import { playsOfTheDay } from "@/types/betTypes";
import useWaveAnimation from "@/hooks/useWaveAnimation";
import { useNavigate } from "react-router-dom";

const BetOfTheDay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPlay = playsOfTheDay[currentIndex];
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const navigate = useNavigate();
  
  // Use the improved hook with custom options
  const { animationPosition, activeLine } = useWaveAnimation({
    totalDuration: 2500,  // Reduced from 3500ms to 2500ms (1 second faster)
    lineChangePoint: 0.5,
    pauseDuration: 300
  });
  
  const isFade = currentPlay.suggestionType === "fade";
  
  // Render the wave text with improved component
  const renderWaveText = (text: string, lineIndex: number) => {
    return (
      <WaveText
        text={text}
        lineIndex={lineIndex}
        activeLine={activeLine}
        animationPosition={animationPosition}
        isFade={isFade}
        waveWidth={0.4}  // Wider wave effect
        maxScale={0.25}  // Slightly reduced scale for smoother animation
        maxGlow={10}     // Adjusted glow intensity
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
  
  // Navigate to leaders page based on type
  const navigateToLeaders = (type: 'tail' | 'fade') => {
    navigate(`/leaders?type=${type}`);
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
      <PlayCard 
        play={currentPlay} 
        renderWaveText={renderWaveText}
        onActionClick={() => navigateToLeaders(isFade ? 'fade' : 'tail')}
      />
      <PaginationIndicator 
        currentIndex={currentIndex} 
        totalItems={playsOfTheDay.length} 
      />
    </div>
  );
};

export default BetOfTheDay;
