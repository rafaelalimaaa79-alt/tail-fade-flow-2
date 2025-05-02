
import React from "react";
import { Bell } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import TrendItem from "@/components/TrendItem";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for the trends page
const trendData = [
  {
    id: "1",
    name: "WinMaster",
    betDescription: "Lakers -5.5",
    betType: "NBA",
    isTailRecommendation: true,
    reason: "8-2 in last 10 bets with consistent NBA picks",
    recentBets: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1], // 1 = win, 0 = loss
    unitPerformance: 8.5,
  },
  {
    id: "2",
    name: "BetKing",
    betDescription: "Chiefs ML",
    betType: "NFL",
    isTailRecommendation: true,
    reason: "7-3 record on NFL favorites",
    recentBets: [1, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    unitPerformance: 6.7,
  },
  {
    id: "3",
    name: "ProPicker",
    betDescription: "Celtics vs Heat Over 220",
    betType: "NBA",
    isTailRecommendation: false,
    reason: "2-8 record on over/under bets",
    recentBets: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    unitPerformance: -7.2,
  },
  {
    id: "4",
    name: "BettingGuru",
    betDescription: "Cowboys -3",
    betType: "NFL",
    isTailRecommendation: true,
    reason: "Solid 7-3 record with NFL spreads",
    recentBets: [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    unitPerformance: 5.9,
  },
  {
    id: "5",
    name: "SportsTipper",
    betDescription: "Yankees ML",
    betType: "MLB",
    isTailRecommendation: false,
    reason: "Only 2-8 in MLB moneyline picks",
    recentBets: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    unitPerformance: -8.3,
  },
  {
    id: "6",
    name: "OddsShark",
    betDescription: "Steelers +3.5",
    betType: "NFL",
    isTailRecommendation: true,
    reason: "7-3 on NFL underdogs",
    recentBets: [1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
    unitPerformance: 7.1,
  }
];

const Trends = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-16"
            />
          </div>
          <button className="rounded-full p-2 text-white/80 hover:text-white">
            <Bell className="h-6 w-6" />
          </button>
        </header>

        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold">Today's Top Trends</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mx-auto">
          {trendData.map((trend) => (
            <TrendItem
              key={trend.id}
              id={trend.id}
              name={trend.name}
              betDescription={trend.betDescription}
              betType={trend.betType}
              reason={trend.reason}
              isTailRecommendation={trend.isTailRecommendation}
              recentBets={trend.recentBets}
              unitPerformance={trend.unitPerformance}
            />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Trends;
