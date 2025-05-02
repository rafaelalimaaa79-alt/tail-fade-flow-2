
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
          {/* Top section with bet description - more compact */}
          <div className="mb-2 border-b border-white/10 pb-1">
            <h2 className="font-rajdhani text-xl font-bold text-white text-center">{betDescription}</h2>
          </div>
          
          {/* Middle section with bettor info and reason - more compact */}
          <div className="mb-2">
            <div className="text-center">
              <span className="italic text-white/70 text-sm font-serif">@{name}</span>
              <div className="mt-1 text-sm">
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
          
          {/* Action button - more compact */}
          <div className="mb-2">
            <ActionButton 
              variant={isTailRecommendation ? "tail" : "fade"}
              className={cn(
                "h-9 text-sm font-bold",
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
                      "h-3 w-3 rounded-sm flex items-center justify-center font-bold text-[10px] text-white",
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
