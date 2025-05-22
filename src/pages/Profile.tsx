
import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import UserHeader from "@/components/profile/UserHeader";
import PendingBetsSection from "@/components/profile/PendingBetsSection";
import PerformanceSection from "@/components/profile/PerformanceSection";
import BiggestWinsSection from "@/components/profile/BiggestWinsSection";

// Mock data
const userProfile = {
  username: "BetterBettor",
  joinDate: "May 2024",
  winRate: 59,
  roi: 14.7,
  profit: 780,
  totalBets: 67,
  rank: 76,
  rankChange: 22, // positive number means they've gone up
  chartData: [
    { timestamp: "2024-01-01", units: 120 },
    { timestamp: "2024-02-01", units: 200 },
    { timestamp: "2024-03-01", units: 150 },
    { timestamp: "2024-04-01", units: 300 },
    { timestamp: "2024-05-01", units: 400 },
  ],
  performanceByTimeframe: {
    '1D': 25,
    '1W': 120,
    '1M': 380,
    '3M': 560,
    '1Y': 780
  },
  stats: {
    betsWon: 37,
    betsLost: 30,
    avgOdds: "+110",
    favorites: ["NBA", "NFL", "UFC"],
  },
  tailingFadingWins: [
    {
      id: "1",
      bet: "Lakers -4.5",
      bettorName: "FadeMaster",
      action: "tailed",
      unitsGained: 3.3,
      outcome: "W"
    },
    {
      id: "2",
      bet: "Celtics +7",
      bettorName: "SportsWizard",
      action: "faded",
      unitsGained: 2.1,
      outcome: "W"
    },
    {
      id: "3",
      bet: "Chiefs -3",
      bettorName: "GridironGuru",
      action: "tailed",
      unitsGained: 4.5,
      outcome: "W"
    },
    {
      id: "4",
      bet: "Knicks ML",
      bettorName: "CourtKing",
      action: "tailed",
      unitsGained: 1.8,
      outcome: "W"
    },
    {
      id: "5",
      bet: "Warriors +5.5",
      bettorName: "BetExpert",
      action: "faded",
      unitsGained: 2.7,
      outcome: "W"
    }
  ]
};

const ProfilePage = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen pb-20">
      <div className="onetime-container">
        <header className="mb-8 flex items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-24"
            />
          </div>
          <div className="flex-grow" />
        </header>

        <UserHeader 
          username={userProfile.username} 
          rank={userProfile.rank} 
          rankChange={userProfile.rankChange} 
        />

        <PendingBetsSection />

        <PerformanceSection 
          winRate={userProfile.winRate}
          roi={userProfile.roi}
          profit={userProfile.profit}
          chartData={userProfile.chartData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          performanceByTimeframe={userProfile.performanceByTimeframe}
        />

        <BiggestWinsSection wins={userProfile.tailingFadingWins} />
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
