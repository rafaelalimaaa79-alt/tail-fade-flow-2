
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ActionButton from "./ActionButton";
import WaveText from "./WaveText";

type TrendItemProps = {
  id: string;
  name: string;
  betDescription: string;
  betType: string;
  reason: string;
  isTailRecommendation: boolean;
  recentBets: number[]; // 1 = win, 0 = loss
  unitPerformance: number;
};

const TrendItem = ({
  id,
  name,
  betDescription,
  betType,
  reason,
  isTailRecommendation,
  recentBets,
  unitPerformance,
}: TrendItemProps) => {
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Handle the pulsing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 2000); // Pulse every 2 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const actionText = isTailRecommendation ? "Tail" : "Fade";
  const actionColor = isTailRecommendation ? "text-onetime-green" : "text-onetime-red";
  const actionBgColor = isTailRecommendation ? "bg-onetime-green/20" : "bg-onetime-red/20";
  const actionBorderColor = isTailRecommendation ? "border-onetime-green/30" : "border-onetime-red/30";
  const glowColor = isTailRecommendation 
    ? "shadow-[0_0_8px_rgba(16,185,129,0.7)]" 
    : "shadow-[0_0_8px_rgba(239,68,68,0.7)]";
  
  return (
    <Link to={`/bettor/${id}`} className="block mb-6">
      <Card className="rounded-xl bg-card shadow-md border border-white/10 overflow-hidden">
        {/* More horizontal layout with columns */}
        <div className="flex flex-col p-4">
          {/* Top section with bet description */}
          <div className="mb-3 border-b border-white/10 pb-2">
            <h2 className="font-rajdhani text-2xl font-bold text-white text-center">{betDescription}</h2>
          </div>
          
          {/* Middle section with bettor info and reason */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="mb-2 sm:mb-0 text-center sm:text-left">
              <span className="italic text-white/70 font-serif">@{name}</span>
              <div className="mt-1 text-lg">
                <span 
                  className={cn(
                    "font-bold",
                    actionColor,
                    isPulsing ? glowColor : ""
                  )}
                  style={{ transition: "all 1s ease-in-out" }}
                >
                </span> {reason}
              </div>
            </div>
          </div>
          
          {/* Tail/Fade button using ActionButton component like in Today's Edge */}
          <div className="mb-3 mt-1">
            <ActionButton 
              variant={isTailRecommendation ? "tail" : "fade"}
              className={cn(
                "h-12 text-lg font-bold",
                isPulsing ? glowColor : ""
              )}
              style={{ transition: "all 1s ease-in-out" }}
            >
              {`${actionText} ${betDescription}`}
            </ActionButton>
          </div>
          
          {/* Bottom section with recent bets directly in the card */}
          <div className="flex items-center justify-center mt-2">
            <div>
              <p className="text-xs text-white/50 mb-1 text-center">Last 10 {betType} bets</p>
              <div className="flex space-x-0.5 justify-center">
                {recentBets.map((bet, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "h-4 w-4 rounded-sm flex items-center justify-center font-bold text-xs text-white",
                      bet ? "bg-onetime-green" : "bg-onetime-red"
                    )}
                  >
                    {bet ? 'W' : 'L'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TrendItem;
