
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
    <div className="rounded-xl bg-white p-5 shadow-md">
      <h2 className="mb-3 text-lg font-bold">Bet of the Day</h2>
      
      <div className="mb-5 text-lg">
        <span className="font-semibold">{betOfTheDay.bettorName}</span> has {streakText}.
        <div className="mt-2 font-medium">
          His bet tonight: <span className="font-bold">{betOfTheDay.bet}</span>
        </div>
      </div>
      
      <div className="mb-5 rounded-lg bg-gray-50 p-3 text-center">
        <p className="text-sm text-gray-500">Our suggestion</p>
        <p className="text-xl font-bold">
          {actionText} {betOfTheDay.bet}
        </p>
      </div>
      
      <ActionButton 
        variant={betOfTheDay.suggestionType === "fade" ? "fade" : "tail"}
      >
        {actionText} This Bet
      </ActionButton>
      
      <Link to="/trends" className="mt-4 flex items-center justify-center text-sm font-medium text-onetime-purple">
        View All Top Trends
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

export default BetOfTheDay;
