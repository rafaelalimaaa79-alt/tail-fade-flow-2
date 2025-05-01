
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TrendItemProps = {
  id: string;
  name: string;
  isTailRecommendation: boolean;
  recentBets: number[]; // 1 = win, 0 = loss
  unitPerformance: number;
};

const TrendItem = ({
  id,
  name,
  isTailRecommendation,
  recentBets,
  unitPerformance,
}: TrendItemProps) => {
  const formattedUnits = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(unitPerformance));
  
  return (
    <Link to={`/bettor/${id}`}>
      <Card className="mb-4 overflow-hidden border border-white/10 hover:border-white/20 transition-all">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">@{name}</h3>
              <p className={cn(
                "text-sm font-medium",
                isTailRecommendation ? "text-onetime-green" : "text-onetime-red"
              )}>
                {isTailRecommendation ? "Tail Recommendation" : "Fade Recommendation"}
              </p>
            </div>
            <div className={cn(
              "px-4 py-2 rounded-full text-white font-bold",
              unitPerformance > 0 ? "bg-onetime-green/20" : "bg-onetime-red/20"
            )}>
              {unitPerformance > 0 ? "+" : ""}{formattedUnits} units
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-white/50 mb-2">Last 10 bets</p>
            <div className="flex space-x-1">
              {recentBets.map((bet, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "h-7 w-7 rounded-sm flex items-center justify-center font-bold text-white",
                    bet ? "bg-onetime-green" : "bg-onetime-red"
                  )}
                >
                  {bet ? 'W' : 'L'}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TrendItem;
