
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import TrendHeader from "./trend/TrendHeader";
import TrendReason from "./trend/TrendReason";
import TrendStats from "./trend/TrendStats";
import TrendAction from "./trend/TrendAction";
import TrendBetHistory from "./trend/TrendBetHistory";
import TrendVisibilityWrapper from "./trend/TrendVisibilityWrapper";

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
  categoryBets?: number[]; // Added: category-specific bet history
  categoryName?: string; // Added: specific category name (e.g., "NBA O/U")
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
  categoryBets, // New prop
  categoryName, // New prop
}: TrendItemProps) => {
  // Calculate win-loss record
  const wins = recentBets.filter(bet => bet === 1).length;
  const losses = recentBets.filter(bet => bet === 0).length;
  const score = isTailRecommendation ? tailScore : fadeScore;
  const userAction = isTailRecommendation ? "tailing" : "fading";
  
  // We'll still clean the reason text, but we won't display it
  const cleanedReason = reason
    .replace(/\d+-\d+(?:\s+(?:record|in|on|with|last))?(?:\s+(?:\d+\s+)?(?:bets|picks|favorites|underdogs|.*bets|.*picks))?/gi, '')
    .trim();
  
  // Determine border color based on recommendation type
  const borderColor = isTailRecommendation ? "border-onetime-green" : "border-onetime-red";
  
  return (
    <div className="block mb-4">
      <TrendVisibilityWrapper>
        {(isVisible, isMostVisible) => (
          <Card 
            className={cn(
              "rounded-lg bg-card shadow-md overflow-hidden min-h-[280px] flex flex-col transition-all duration-300",
              isMostVisible ? borderColor : "border-gray-500",
              !isMostVisible && "grayscale",
              isMostVisible && "animate-pulse-slow" // Add pulsing animation to the card border
            )}
            style={isMostVisible ? {
              boxShadow: isTailRecommendation 
                ? "0 0 10px rgba(16, 185, 129, 0.7)" 
                : "0 0 10px rgba(239, 68, 68, 0.7)"
            } : undefined}
          >
            <div className="flex flex-col p-4 flex-grow">
              <TrendHeader 
                name={name}
                score={score}
                isTailRecommendation={isTailRecommendation}
                isMostVisible={isMostVisible}
              />
              
              {/* We'll keep this for future use but it's hidden */}
              <TrendReason reason={cleanedReason} />
              
              <TrendStats
                wins={wins}
                losses={losses}
                betType={betType}
                userCount={userCount}
                userAction={userAction}
                bettorName={name}
                isMostVisible={isMostVisible}
              />
              
              {/* Spacer to push action button and bet history to bottom */}
              <div className="flex-grow"></div>
              
              {/* Add more spacing above the action button to move it lower */}
              <div className="mt-6">
                <TrendAction 
                  isTailRecommendation={isTailRecommendation}
                  betDescription={betDescription}
                  bettorName={name}
                  isMostVisible={isMostVisible}
                  wins={wins}
                  losses={losses}
                  betType={betType}
                />
              </div>
              
              {/* Bet history directly below action button with small spacing */}
              <div className="mt-3">
                <TrendBetHistory 
                  recentBets={recentBets}
                  betType={betType}
                  categoryBets={categoryBets}
                  categoryName={categoryName}
                  isMostVisible={isMostVisible}
                />
              </div>
            </div>
          </Card>
        )}
      </TrendVisibilityWrapper>
    </div>
  );
};

export default TrendItem;
