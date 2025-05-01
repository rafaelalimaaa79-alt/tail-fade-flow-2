
import React from "react";
import { ArrowRight } from "lucide-react";
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
      <h2 className="mb-4 text-lg font-bold text-white/90">Bet of the Day</h2>
      
      <div className="mb-6 text-lg text-white/80">
        <span className="font-semibold text-white">{betOfTheDay.bettorName}</span> has {streakText}.
        <div className="mt-3 font-medium">
          His bet tonight: <span className="font-bold text-white">{betOfTheDay.bet}</span>
        </div>
      </div>
      
      <div className="mb-6 rounded-lg bg-muted p-4 text-center border border-white/10">
        <p className="text-sm text-white/60">Our suggestion</p>
        <p className="text-xl font-bold text-white">
          {actionText} {betOfTheDay.bet}
        </p>
      </div>
      
      <ActionButton 
        variant={betOfTheDay.suggestionType === "fade" ? "fade" : "tail"}
      >
        {actionText} This Bet
      </ActionButton>
      
      <Link to="/trends" className="mt-5 flex items-center justify-center text-sm font-medium text-primary">
        View All Top Trends
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

export default BetOfTheDay;
