
import React, { useState } from "react";
import { Bell } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import TrendItem from "@/components/TrendItem";
import TimeFilter from "@/components/TimeFilter";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for the trends page
const trendData = [
  {
    id: "1",
    name: "WinMaster",
    isTailRecommendation: true,
    recentBets: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1], // 1 = win, 0 = loss
    unitPerformance: 8.5,
  },
  {
    id: "2",
    name: "BetKing",
    isTailRecommendation: true,
    recentBets: [1, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    unitPerformance: 6.7,
  },
  {
    id: "3",
    name: "ProPicker",
    isTailRecommendation: false,
    recentBets: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    unitPerformance: -7.2,
  },
  {
    id: "4",
    name: "BettingGuru",
    isTailRecommendation: true,
    recentBets: [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    unitPerformance: 5.9,
  },
  {
    id: "5",
    name: "SportsTipper",
    isTailRecommendation: false,
    recentBets: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    unitPerformance: -8.3,
  },
  {
    id: "6",
    name: "OddsShark",
    isTailRecommendation: true,
    recentBets: [1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
    unitPerformance: 7.1,
  }
];

const Trends = () => {
  const [activeFilter, setActiveFilter] = useState("1w");
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-20"
            />
          </div>
          <button className="rounded-full p-2 text-white/80 hover:text-white">
            <Bell className="h-6 w-6" />
          </button>
        </header>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Today's Top Trends</h1>
        </div>
        
        <TimeFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <div className="my-6 space-y-4">
          {trendData.map((trend) => (
            <TrendItem
              key={trend.id}
              id={trend.id}
              name={trend.name}
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
