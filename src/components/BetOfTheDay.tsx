
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import ActionButton from "./ActionButton";
import { Link } from "react-router-dom";

// Mock data with multiple bets
const playsOfTheDay = [
  {
    bettorName: "NoCoverKev",
    bet: "Celtics -6.5",
    suggestionType: "fade",
    stats: "2–12 in his last 14 bets",
    percentage: 89
  },
  {
    bettorName: "MoneyMaker22",
    bet: "Rangers ML",
    suggestionType: "tail",
    stats: "+11.4u this week",
    percentage: 84
  },
  {
    bettorName: "ColdHands88",
    bet: "Yankees ML",
    suggestionType: "fade",
    stats: "Lost 6 straight MLB bets",
    percentage: 78
  },
  {
    bettorName: "SharpSniper17",
    bet: "Nuggets -4.5",
    suggestionType: "tail",
    stats: "On a 9–1 heater",
    percentage: 75
  },
  {
    bettorName: "SlumpCityJack",
    bet: "Dodgers -1.5",
    suggestionType: "fade",
    stats: "0–7 on last run line picks",
    percentage: 72
  }
];

const BetOfTheDay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPlay = playsOfTheDay[currentIndex];
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [animationPosition, setAnimationPosition] = useState(0); // 0 to 1 position
  const [activeLine, setActiveLine] = useState(0); // 0 = first line, 1 = second line
  
  const isFade = currentPlay.suggestionType === "fade";
  const actionText = isFade ? "Fade" : "Tail";
  
  // Split text into words for animation
  const renderWaveText = (text, lineIndex) => {
    const words = text.split(' ');
    return words.map((word, index) => {
      // Calculate position of this word in the text (as percentage of total width)
      const wordPosition = index / (words.length - 1);
      
      // Calculate distance from the wave position
      // We use a continuous sine wave that moves across the text
      const distance = Math.abs(wordPosition - animationPosition);
      
      // Create a wave effect with a gaussian-like curve that affects multiple words
      // Smaller values = broader wave effect
      const waveWidth = 0.15;
      
      // Calculate influence factor (0 to 1) based on distance from wave center
      let influence = Math.max(0, 1 - (distance / waveWidth));
      
      // Apply a curve to make it more wave-like
      influence = Math.pow(influence, 2);
      
      // Only apply effect to current line
      if (lineIndex !== activeLine) {
        influence = 0;
      }
      
      // Scale and glow effects based on influence
      const scale = 1 + (influence * 0.4); // Max 40% larger
      const glow = Math.round(influence * 12);
      const opacity = 0.7 + (influence * 0.3); // Varies from 0.7 to 1
      
      const isHighlighted = influence > 0.5;
      
      // Calculate color based on suggestion type
      const baseColor = isFade ? 'var(--onetime-red)' : 'var(--onetime-green)';
      const glowColor = isFade ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)';
      
      return (
        <span 
          key={index} 
          className="word"
          style={{
            display: 'inline-block',
            marginRight: '4px',
            transform: `scale(${scale})`,
            transition: 'all 0.15s ease-out',
            color: influence > 0 ? baseColor : 'inherit',
            opacity: opacity,
            fontWeight: influence > 0.3 ? 'bold' : 'normal',
            textShadow: influence > 0 ? `0 0 ${glow}px ${glowColor}` : 'none',
            position: 'relative',
            zIndex: Math.round(influence * 10)
          }}
        >
          {word}
        </span>
      );
    });
  };
  
  // Handle next play
  const nextPlay = () => {
    setCurrentIndex((prev) => (prev + 1) % playsOfTheDay.length);
    setAnimationPosition(0);
    setActiveLine(0);
  };
  
  // Handle previous play
  const prevPlay = () => {
    setCurrentIndex((prev) => (prev === 0 ? playsOfTheDay.length - 1 : prev - 1));
    setAnimationPosition(0);
    setActiveLine(0);
  };
  
  // Smooth wave animation effect
  useEffect(() => {
    let animationFrame;
    let startTime = null;
    const totalDuration = 4000; // Total animation time in ms
    const lineChangePoint = 0.5; // When to switch lines (0.5 = halfway)
    
    const animate = (timestamp) => {
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
  }, [currentPlay, isFade]);
  
  // Touch event handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e) => {
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
      className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-width large title */}
      <div className="mb-5 border-b border-white/10 pb-2">
        <h2 className="text-2xl font-extrabold text-white text-center">Plays of the Day</h2>
      </div>
      
      {/* Bettor info with italic usernames and highlighted stats */}
      <div className="mb-6 text-lg text-white/80 text-center">
        <span className="font-normal italic text-white/70 font-serif">{currentPlay.bettorName}</span>
        <div className="mt-3 text-xl font-medium">
          <div className="wave-text-container">
            <div className="block mb-2">
              {renderWaveText(currentPlay.stats, 0)}
            </div>
            <div className="block">
              {renderWaveText(`${currentPlay.percentage}% ${isFade ? "fading" : "tailing"}`, 1)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Combined suggestion and action in a single card */}
      <div className="mb-6 rounded-lg bg-muted p-5 text-center border border-white/10 shadow-lg">
        <p className="text-2xl font-extrabold text-white mb-4 flex items-center justify-center gap-2">
          <span className={isFade ? "text-onetime-red font-black" : "text-onetime-green font-black"}>{actionText}</span> 
          <span>{currentPlay.bet}</span>
        </p>
        
        <ActionButton 
          variant={isFade ? "fade" : "tail"}
          className="h-14 text-base font-bold"
        >
          {isFade ? "🔥 Fade This Bet" : "🔥 Tail This Bet"}
        </ActionButton>
      </div>
      
      {/* Secondary action link */}
      <Link to="/trends" className="mt-5 flex items-center justify-center text-sm font-medium text-primary">
        👀 View All Top Trends
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>

      {/* Subtle pagination indicator */}
      <div className="mt-4 flex justify-center gap-1">
        {playsOfTheDay.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BetOfTheDay;
