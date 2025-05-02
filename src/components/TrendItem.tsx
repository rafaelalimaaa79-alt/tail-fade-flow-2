
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ActionButton from "./ActionButton";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

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
  const [isMostVisible, setIsMostVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentItem = itemRef.current;
    if (!currentItem) return;

    // Create an intersection observer to detect when the item is visible
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // Use viewport as root
        rootMargin: "0px",
        threshold: 0.1, // Item is considered visible with just 10% showing
      }
    );
    
    // Start observing this item
    visibilityObserver.observe(currentItem);
    
    // Create a function that checks which visible trend item is most centered
    const checkMostCentered = () => {
      // Only proceed if this item is visible
      if (!isVisible || !currentItem) {
        setIsMostVisible(false);
        return;
      }
      
      // Get all trend items
      const allTrendItems = document.querySelectorAll('.trend-item');
      
      // Calculate the center of the viewport
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      let closestItem = null;
      let closestDistance = Infinity;
      
      // Find which item's center is closest to viewport center
      allTrendItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distanceToCenter = Math.abs(itemCenter - viewportCenter);
        
        if (distanceToCenter < closestDistance) {
          closestDistance = distanceToCenter;
          closestItem = item;
        }
      });
      
      // Check if this item is the closest
      setIsMostVisible(closestItem === currentItem);
    };
    
    // Check on scroll and resize
    window.addEventListener('scroll', checkMostCentered);
    window.addEventListener('resize', checkMostCentered);
    
    // Initial check
    setTimeout(checkMostCentered, 100);
    
    return () => {
      // Clean up
      if (currentItem) {
        visibilityObserver.unobserve(currentItem);
      }
      window.removeEventListener('scroll', checkMostCentered);
      window.removeEventListener('resize', checkMostCentered);
    };
  }, [isVisible]);
  
  const actionText = isTailRecommendation ? "Tail" : "Fade";
  const actionColor = isTailRecommendation ? "text-onetime-green" : "text-onetime-red";
  const actionBgColor = isTailRecommendation ? "bg-onetime-green/20" : "bg-onetime-red/20";
  const actionBorderColor = isTailRecommendation ? "border-onetime-green/30" : "border-onetime-red/30";
  const score = isTailRecommendation ? tailScore : fadeScore;
  const userAction = isTailRecommendation ? "tailing" : "fading";
  const glowColor = isTailRecommendation ? "0 0 10px rgba(16, 185, 129, 0.7)" : "0 0 10px rgba(239, 68, 68, 0.7)";
  
  // Calculate win-loss record
  const wins = recentBets.filter(bet => bet === 1).length;
  const losses = recentBets.filter(bet => bet === 0).length;
  const recordText = `${wins}–${losses} in last ${recentBets.length} ${betType} bets`;
  
  return (
    <Link to={`/bettor/${id}`} className="block mb-3">
      <Card 
        ref={itemRef} 
        className={cn(
          "rounded-lg bg-card shadow-md border border-white/10 overflow-hidden trend-item"
        )}
      >
        <div className="flex flex-col p-3">
          {/* Top section with username and score percentage */}
          <div className="mb-2 border-b border-white/10 pb-2">
            <div className="flex justify-center items-center">
              <h2 className="font-rajdhani text-xl font-bold text-white text-center">@{name}</h2>
            </div>
            <div className="flex justify-center mt-1">
              <span 
                className={cn(
                  "font-bold text-base px-3 py-0.5 rounded",
                  isTailRecommendation ? "bg-onetime-green/20 text-onetime-green" : "bg-onetime-red/20 text-onetime-red",
                  isMostVisible && "animate-pulse-heartbeat"
                )}
                style={{
                  boxShadow: isMostVisible ? glowColor : "none",
                }}
              >
                Confidence Score: {score}%
              </span>
            </div>
          </div>
          
          {/* Reason section */}
          <div className="mb-4 px-2">
            <div className="text-center">
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
          
          {/* Stats section - completely reorganized for better structure */}
          <div className="mb-4 bg-white/5 rounded-lg p-3">
            {/* Performance record */}
            <div className="flex flex-col space-y-2">
              <div>
                <p className="text-xs text-white/50 mb-1">Performance</p>
                <div className="font-medium">
                  <span className={cn(
                    "font-bold",
                    wins > losses ? "text-onetime-green" : "text-onetime-red"
                  )}>
                    {recordText}
                  </span>
                </div>
              </div>
              
              {/* User adoption with icon */}
              <div>
                <p className="text-xs text-white/50 mb-1">Community</p>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-sm text-white/90">{userCount} users {userAction}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Clear divider before action button */}
          <Separator className="mb-4 bg-white/10" />
          
          {/* Action button */}
          <div className="mb-4">
            <ActionButton 
              variant={isTailRecommendation ? "tail" : "fade"}
              className={cn(
                "h-9 text-base font-bold w-full",
                isMostVisible && "animate-pulse-heartbeat"
              )}
              style={{
                boxShadow: isMostVisible ? glowColor : "none",
              }}
            >
              {`${actionText} ${betDescription}`}
            </ActionButton>
          </div>
          
          {/* Recent bets section with better spacing */}
          <div>
            <p className="text-xs text-white/50 mb-2 text-center">Last {recentBets.length} {betType} bets</p>
            <div className="flex justify-center space-x-1.5">
              {recentBets.map((bet, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "h-6 w-6 rounded-sm flex items-center justify-center font-bold text-xs text-white",
                    bet ? "bg-onetime-green" : "bg-onetime-red"
                  )}
                >
                  {bet ? 'W' : 'L'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TrendItem;
