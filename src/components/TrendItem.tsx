
import React, { useState, useEffect, useRef } from "react";
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
  tailScore?: number; // Optional score for tail recommendation
  fadeScore?: number; // Optional score for fade recommendation
  userCount?: number; // Number of users tailing or fading
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
  tailScore = 75, // Default value
  fadeScore = 80, // Default value
  userCount = 210, // Default value
}: TrendItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection status changes
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // Use viewport as root
        rootMargin: "0px",
        threshold: 0.5, // At least 50% of the item must be visible
      }
    );
    
    if (itemRef.current) {
      observer.observe(itemRef.current);
    }
    
    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);
  
  const actionText = isTailRecommendation ? "Tail" : "Fade";
  const actionColor = isTailRecommendation ? "text-onetime-green" : "text-onetime-red";
  const actionBgColor = isTailRecommendation ? "bg-onetime-green/20" : "bg-onetime-red/20";
  const actionBorderColor = isTailRecommendation ? "border-onetime-green/30" : "border-onetime-red/30";
  const score = isTailRecommendation ? tailScore : fadeScore;
  const userAction = isTailRecommendation ? "tailing" : "fading";
  const glowColor = isTailRecommendation ? "0 0 10px rgba(16, 185, 129, 0.7)" : "0 0 10px rgba(239, 68, 68, 0.7)";
  
  return (
    <Link to={`/bettor/${id}`} className="block mb-3">
      <Card ref={itemRef} className="rounded-lg bg-card shadow-md border border-white/10 overflow-hidden">
        <div className="flex flex-col p-3">
          {/* Top section with username and score percentage - centered username */}
          <div className="mb-2 border-b border-white/10 pb-2">
            <div className="flex justify-center items-center">
              <h2 className="font-rajdhani text-xl font-bold text-white text-center">@{name}</h2>
            </div>
            <div className="flex justify-center mt-1">
              <span 
                className={cn(
                  "font-bold text-base px-3 py-0.5 rounded",
                  isTailRecommendation ? "bg-onetime-green/20 text-onetime-green" : "bg-onetime-red/20 text-onetime-red",
                  isVisible && "animate-pulse-heartbeat"
                )}
                style={{
                  boxShadow: glowColor,
                }}
              >
                Confidence Score: {score}%
              </span>
            </div>
          </div>
          
          {/* Reason section - centered and well formatted */}
          <div className="mb-3 px-2">
            <div className="text-center">
              <div className="mt-1">
                <span 
                  className="font-bold text-lg text-white"
                  style={{ 
                    letterSpacing: "0.5px"
                  }}
                >
                  {reason}
                </span>
              </div>
            </div>
          </div>
          
          {/* User count section */}
          <div className="flex justify-center items-center mb-3">
            <div className="flex items-center">
              <span className="font-bold text-white">{userCount} users {userAction}</span>
            </div>
          </div>
          
          {/* Action button - only showing bet description with heartbeat glow effect */}
          <div className="mb-3">
            <ActionButton 
              variant={isTailRecommendation ? "tail" : "fade"}
              className={cn(
                "h-9 text-base font-bold",
                isVisible && "animate-pulse-heartbeat"
              )}
              style={{
                boxShadow: glowColor,
              }}
            >
              {`${actionText} ${betDescription}`}
            </ActionButton>
          </div>
          
          {/* Recent bets section with label */}
          <div className="flex items-center justify-center">
            <div>
              <p className="text-xs text-white/50 mb-1 text-center">Last 10 {betType} bets</p>
              <div className="flex space-x-1 justify-center">
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
