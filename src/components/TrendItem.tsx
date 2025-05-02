
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ActionButton from "./ActionButton";

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
    <Link to={`/bettor/${id}`} className="block mb-3">
      <Card className="rounded-lg bg-card shadow-md border border-white/10 overflow-hidden">
        <div className="flex flex-col p-3">
          {/* Top section with username and bet description - restructured */}
          <div className="mb-2 border-b border-white/10 pb-1">
            <h2 className="font-rajdhani text-xl font-bold text-white text-center">@{name}</h2>
          </div>
          
          {/* Middle section with reason - enlarged with neon text effect */}
          <div className="mb-4">
            <div className="text-center">
              <div className="mt-1">
                <span 
                  className={cn(
                    "font-bold text-xl text-white", // Increased font size and made white
                    isPulsing ? "animate-pulse-subtle" : ""
                  )}
                  style={{ 
                    transition: "all 1s ease-in-out",
                    textShadow: isTailRecommendation 
                      ? "0 0 10px rgba(16,185,129,0.8), 0 0 20px rgba(16,185,129,0.5)" 
                      : "0 0 10px rgba(239,68,68,0.8), 0 0 20px rgba(239,68,68,0.5)",
                    letterSpacing: "0.5px"
                  }}
                >
                  {reason}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action button - only showing bet description */}
          <div className="mb-2">
            <ActionButton 
              variant={isTailRecommendation ? "tail" : "fade"}
              className={cn(
                "h-9 text-base font-bold",
                isPulsing ? glowColor : ""
              )}
              style={{ transition: "all 1s ease-in-out" }}
            >
              {`${actionText} ${betDescription}`}
            </ActionButton>
          </div>
          
          {/* Recent bets - more compact */}
          <div className="flex items-center justify-center">
            <div>
              <p className="text-xs text-white/50 mb-0.5 text-center">Last 10 {betType} bets</p>
              <div className="flex space-x-0.5 justify-center">
                {recentBets.map((bet, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "h-5 w-5 rounded-sm flex items-center justify-center font-bold text-[12px] text-white",
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
