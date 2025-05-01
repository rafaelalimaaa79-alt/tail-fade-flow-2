
import React, { useState, useEffect } from "react";
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
  
  const isFade = currentPlay.suggestionType === "fade";
  const actionText = isFade ? "Fade" : "Tail";
  
  // Auto rotate through plays every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % playsOfTheDay.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow">
      {/* Full-width large title */}
      <div className="mb-5 border-b border-white/10 pb-2">
        <h2 className="text-2xl font-extrabold text-white">Plays of the Day</h2>
      </div>
      
      {/* Bettor info with bold highlighting */}
      <div className="mb-6 text-lg text-white/80">
        <span className="font-extrabold text-white">{currentPlay.bettorName}</span> – {currentPlay.bet}
        <div className="mt-2 text-sm">
          <span className="text-white/80">{currentPlay.stats}</span>
        </div>
        <div className="mt-1 text-sm">
          <span className="font-medium">{currentPlay.percentage}% {isFade ? "fading" : "tailing"}</span>
        </div>
      </div>
      
      {/* High-impact suggestion card - now with contrasting styles instead of all red */}
      <div className="mb-6 rounded-lg bg-muted p-5 text-center border border-white/10 shadow-lg">
        <p className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
          <span className="text-onetime-red">💥</span> 
          <span className={isFade ? "text-onetime-red font-black" : "text-onetime-green font-black"}>{actionText}</span> 
          <span>{currentPlay.bet}</span>
        </p>
      </div>
      
      {/* Primary action button */}
      <ActionButton 
        variant={isFade ? "fade" : "tail"}
        className="h-14 text-base font-bold"
      >
        {isFade ? "🔥 Fade This Bet" : "🔥 Tail This Bet"}
      </ActionButton>
      
      {/* Secondary action link */}
      <Link to="/trends" className="mt-5 flex items-center justify-center text-sm font-medium text-primary">
        👀 View All Top Trends
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

export default BetOfTheDay;
