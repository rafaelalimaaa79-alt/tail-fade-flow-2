
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
  const formattedUnits = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(unitPerformance));
  
  const actionText = isTailRecommendation ? "Tail" : "Fade";
  
  return (
    <Link to={`/bettor/${id}`} className="block mb-8">
      <Card className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow">
        {/* Full-width large title */}
        <div className="mb-5 border-b border-white/10 pb-2">
          <h2 className="font-rajdhani text-3xl font-extrabold text-white text-center tracking-wider uppercase">{betDescription}</h2>
        </div>
        
        {/* Bettor info with italic usernames and highlighted stats */}
        <div className="mb-6 text-lg text-white/80 text-center">
          <span className="font-normal italic text-white/70 font-serif">@{name}</span>
          <div className="mt-3 text-xl font-medium">
            <div className="block mb-2">
              <span 
                className={cn(
                  "font-bold",
                  isTailRecommendation ? "text-onetime-green" : "text-onetime-red"
                )}
              >
                {actionText}
              </span> {reason}
            </div>
          </div>
        </div>
        
        {/* Combined suggestion and action in a single card */}
        <div className="mb-4 rounded-lg bg-muted p-5 text-center border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50 mb-1">Last 10 {betType} bets</p>
              <div className="flex space-x-0.5">
                {recentBets.map((bet, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "h-5 w-5 rounded-sm flex items-center justify-center font-bold text-xs text-white",
                      bet ? "bg-onetime-green" : "bg-onetime-red"
                    )}
                  >
                    {bet ? 'W' : 'L'}
                  </div>
                ))}
              </div>
            </div>
            <div className={cn(
              "px-4 py-2 rounded-full text-white font-bold",
              unitPerformance > 0 ? "bg-onetime-green/20" : "bg-onetime-red/20"
            )}>
              {unitPerformance > 0 ? "+" : ""}{formattedUnits} units
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TrendItem;
