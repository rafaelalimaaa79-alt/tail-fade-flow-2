
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
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const statsRef = useRef(null);
  const percentageRef = useRef(null);
  
  const isFade = currentPlay.suggestionType === "fade";
  const actionText = isFade ? "Fade" : "Tail";
  
  // Split text into characters for animation
  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span 
        key={index} 
        className={`char ${activeCharIndex === index ? 'active' : ''}`}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };
  
  // Handle next play
  const nextPlay = () => {
    setCurrentIndex((prev) => (prev + 1) % playsOfTheDay.length);
    setActiveCharIndex(-1); // Reset animation when changing plays
  };
  
  // Handle previous play
  const prevPlay = () => {
    setCurrentIndex((prev) => (prev === 0 ? playsOfTheDay.length - 1 : prev - 1));
    setActiveCharIndex(-1); // Reset animation when changing plays
  };
  
  // Text wave animation
  useEffect(() => {
    // Combine stats and percentage for animation
    const statsText = currentPlay.stats;
    const percentageText = `${currentPlay.percentage}% ${isFade ? "fading" : "tailing"}`;
    const totalChars = statsText.length + percentageText.length + 1; // +1 for the space we'll add between
    
    let animationFrame;
    let charIndex = -5; // Start before the text to create a smooth entry
    
    const animateText = () => {
      charIndex = (charIndex + 1) % (totalChars + 10); // +10 for a pause between loops
      
      // Only set the active index when it's in range
      if (charIndex >= 0 && charIndex < totalChars) {
        setActiveCharIndex(charIndex);
      } else {
        setActiveCharIndex(-1); // Hide when out of range for pause
      }
      
      animationFrame = requestAnimationFrame(() => {
        setTimeout(animateText, 100); // Controls the speed of the animation
      });
    };
    
    animateText();
    
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
            <div 
              ref={statsRef}
              className={`wave-text ${isFade ? "red" : "green"} block mb-2`}
            >
              {splitText(currentPlay.stats)}
            </div>
            <div 
              ref={percentageRef}
              className={`wave-text ${isFade ? "red" : "green"} block`}
            >
              {splitText(`${currentPlay.percentage}% ${isFade ? "fading" : "tailing"}`)}
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
