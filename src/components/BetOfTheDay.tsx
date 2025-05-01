
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
  const [animatingLine, setAnimatingLine] = useState(0); // 0 = first line, 1 = second line
  const [animationProgress, setAnimationProgress] = useState(0); // 0 to 100% progress
  
  const isFade = currentPlay.suggestionType === "fade";
  const actionText = isFade ? "Fade" : "Tail";
  
  // Split text into words for animation
  const splitTextIntoWords = (text, lineIndex) => {
    const words = text.split(' ');
    return words.map((word, index) => {
      // Calculate how "active" this word is based on animation progress
      // Each word gets a "window" of activity during the animation
      const wordCount = words.length;
      const wordPosition = index / wordCount; // 0 to 1 position in the text
      const windowSize = 0.2; // Size of the active window (adjust for speed)
      
      // Calculate word's distance from the current animation position
      let distanceFromActive = Math.abs(animationProgress - wordPosition);
      if (animatingLine !== lineIndex) {
        distanceFromActive = 1; // Not active if not on current line
      }
      
      // Calculate scale based on proximity to animation point
      const scale = distanceFromActive < windowSize 
        ? 1 + ((windowSize - distanceFromActive) / windowSize) * 0.5 // Max scale 1.5x
        : 1;
      
      // Calculate opacity for the glow effect
      const glowOpacity = distanceFromActive < windowSize
        ? ((windowSize - distanceFromActive) / windowSize)
        : 0;
      
      const isActive = glowOpacity > 0.2; // Threshold for "active" styling
      
      return (
        <span 
          key={index} 
          className={`word ${isActive ? 'active' : ''}`}
          style={{
            display: 'inline-block',
            marginRight: '4px',
            transform: `scale(${scale})`,
            transition: 'transform 0.2s ease',
            color: isActive 
              ? (isFade ? 'var(--onetime-red)' : 'var(--onetime-green)') 
              : 'inherit',
            textShadow: isActive
              ? `0 0 ${Math.round(glowOpacity * 8)}px ${isFade ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)'}`
              : 'none',
            fontWeight: isActive ? 'bold' : 'normal'
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
    setAnimatingLine(0); // Reset to first line
    setAnimationProgress(0); // Reset animation
  };
  
  // Handle previous play
  const prevPlay = () => {
    setCurrentIndex((prev) => (prev === 0 ? playsOfTheDay.length - 1 : prev - 1));
    setAnimatingLine(0); // Reset to first line
    setAnimationProgress(0); // Reset animation
  };
  
  // Wave animation effect
  useEffect(() => {
    const statsText = currentPlay.stats;
    const percentageText = `${currentPlay.percentage}% ${isFade ? "fading" : "tailing"}`;
    const textsArray = [statsText, percentageText];
    
    let animationFrame;
    let startTime = null;
    const totalDuration = 3000; // Total animation time for both lines
    const lineDuration = totalDuration / 2; // Duration per line
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate total progress (0 to 1)
      const totalProgress = Math.min(elapsed / totalDuration, 1);
      
      // Determine which line is active and the progress within that line
      if (totalProgress < 0.5) {
        // First line animation (0 to 0.5 of total)
        setAnimatingLine(0);
        setAnimationProgress(totalProgress * 2); // Scale 0-0.5 to 0-1
      } else {
        // Second line animation (0.5 to 1.0 of total)
        setAnimatingLine(1);
        setAnimationProgress((totalProgress - 0.5) * 2); // Scale 0.5-1 to 0-1
      }
      
      // Continue animation if not complete
      if (totalProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Reset animation after completion
        setTimeout(() => {
          setAnimatingLine(0);
          setAnimationProgress(0);
          startTime = null;
          animationFrame = requestAnimationFrame(animate); // Restart the animation
        }, 500); // Pause between animation cycles
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
            <div className={`wave-text ${isFade ? "red" : "green"} block mb-2`}>
              {splitTextIntoWords(currentPlay.stats, 0)}
            </div>
            <div className={`wave-text ${isFade ? "red" : "green"} block`}>
              {splitTextIntoWords(`${currentPlay.percentage}% ${isFade ? "fading" : "tailing"}`, 1)}
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
