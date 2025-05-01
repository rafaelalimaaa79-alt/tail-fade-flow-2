
import React from "react";
import { ArrowRight, AlertTriangle } from "lucide-react";
import ActionButton from "./ActionButton";
import { Link } from "react-router-dom";

// Mock data - this would come from an API in a real app
const betOfTheDay = {
  bettorName: "John",
  streak: -8, // Negative for losing streak
  bet: "Yankees ML",
  suggestionType: "fade", // 'tail' or 'fade'
};

const BetOfTheDay = () => {
  const isLosingStreak = betOfTheDay.streak < 0;
  const streakText = isLosingStreak 
    ? `lost ${Math.abs(betOfTheDay.streak)} straight` 
    : `won ${betOfTheDay.streak} straight`;
  const actionText = betOfTheDay.suggestionType === "fade" ? "Fade" : "Tail";
  
  return (
    <div className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow">
      {/* High-impact title with emoji */}
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle className="h-5 w-5 text-onetime-orange animate-pulse-subtle" />
        <h2 className="text-xl font-extrabold text-white">🚨 Bet of the Day</h2>
      </div>
      
      {/* Bettor streak info with bold highlighting */}
      <div className="mb-6 text-lg text-white/80">
        <span className="font-extrabold text-white">{betOfTheDay.bettorName}</span> has {streakText}.
        <div className="mt-3 font-medium">
          His bet tonight: <span className="font-extrabold text-white">{betOfTheDay.bet}</span>
        </div>
      </div>
      
      {/* High-impact suggestion card - now with contrasting styles instead of all red */}
      <div className="mb-6 rounded-lg bg-muted p-5 text-center border border-white/10 shadow-lg">
        <p className="text-sm text-white/80">Our suggestion</p>
        <p className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
          <span className="text-onetime-red">💥</span> 
          <span className="text-onetime-red font-black">{actionText}</span> 
          <span>{betOfTheDay.bet}</span>
        </p>
      </div>
      
      {/* Primary action button */}
      <ActionButton 
        variant={betOfTheDay.suggestionType === "fade" ? "fade" : "tail"}
        className="h-14 text-base font-bold"
      >
        🔥 {actionText} This Bet
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
