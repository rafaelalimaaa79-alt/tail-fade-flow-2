
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
  // Calculate win-loss record
  const wins = recentBets.filter(bet => bet === 1).length;
  const losses = recentBets.filter(bet => bet === 0).length;
  const score = isTailRecommendation ? tailScore : fadeScore;
  const userAction = isTailRecommendation ? "tailing" : "fading";
  
  return (
    <div className="block mb-3">
      <TrendVisibilityWrapper>
        {(isVisible, isMostVisible) => (
          <Card className="rounded-lg bg-card shadow-md border border-white/10 overflow-hidden">
            <div className="flex flex-col p-3">
              <TrendHeader 
                name={name}
                score={score}
                isTailRecommendation={isTailRecommendation}
                isMostVisible={isMostVisible}
              />
              
              <TrendReason reason={reason} />
              
              <TrendStats 
                wins={wins}
                losses={losses}
                betType={betType}
                recentBetsLength={recentBets.length}
                userCount={userCount}
                userAction={userAction}
              />
              
              <Separator className="mb-4 bg-white/10" />
              
              <TrendAction 
                isTailRecommendation={isTailRecommendation}
                betDescription={betDescription}
                bettorName={name}
                isMostVisible={isMostVisible}
              />
              
              <TrendBetHistory 
                recentBets={recentBets}
                betType={betType}
              />
            </div>
          </Card>
        )}
      </TrendVisibilityWrapper>
    </div>
  );
};

export default TrendItem;
