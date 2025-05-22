
import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import TimeFilter from "@/components/TimeFilter";
import BetHistoryChart from "@/components/BetHistoryChart";
import BettorPerformanceGraph from "@/components/BettorPerformanceGraph";
import BettorTimeFilter from "@/components/BettorTimeFilter";
import { Badge } from "@/components/ui/badge";
import PendingBetsList from "@/components/profile/PendingBetsList";
import { ArrowUp, ArrowDown } from "lucide-react";

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

        {/* User Header - Rearranged and restyled */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white font-rajdhani tracking-wider neon-text">@{userProfile.username}</h1>
            {/* Rank information moved to top right where "Joined" used to be */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-onetime-purple px-3 py-1">
              <span className="text-xs font-bold text-white">Rank {userProfile.rank}</span>
              {userProfile.rankChange !== 0 && (
                <div className="flex items-center gap-0.5">
                  {userProfile.rankChange > 0 ? (
                    <ArrowUp className="h-3 w-3 text-onetime-green" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-onetime-red" />
                  )}
                  <span className={`text-xs font-medium ${userProfile.rankChange > 0 ? 'text-onetime-green' : 'text-onetime-red'}`}>
                    {Math.abs(userProfile.rankChange)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Bets Section - Added purple neon pulse effect */}
        <div className="my-4 rounded-xl bg-black p-4 shadow-md relative animate-glow-pulse-purple overflow-hidden border border-onetime-purple/30">
          <div className="absolute inset-0 bg-onetime-purple/5 backdrop-blur-sm pointer-events-none"></div>
          <h3 className="mb-4 text-xl font-bold text-white relative z-10">Pending Bets</h3>
          <div className="relative z-10">
            <PendingBetsList />
          </div>
        </div>

        {/* Performance Section with integrated stats */}
        <div className="my-4 rounded-xl bg-black p-4 shadow-md border border-white/10">
          <div className="my-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Performance</h3>
              <BettorTimeFilter
                activeFilter={timeframe}
                onChange={setTimeframe}
                performanceByTimeframe={userProfile.performanceByTimeframe}
                className="scale-90 origin-right"
              />
            </div>

            {/* Stats positioned first now, before the graph */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-center">
                <p className="text-xs text-gray-400">Win Rate</p>
                <p className="text-lg font-bold text-white">{userProfile.winRate}%</p>
              </div>
              <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-center">
                <p className="text-xs text-gray-400">ROI</p>
                <p
                  className={`text-lg font-bold ${
                    userProfile.roi >= 0 ? "text-onetime-green" : "text-onetime-red"
                  }`}
                >
                  {userProfile.roi > 0 && "+"}
                  {userProfile.roi}%
                </p>
              </div>
              <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-center">
                <p className="text-xs text-gray-400">Profit</p>
                <p
                  className={`text-lg font-bold ${
                    userProfile.profit >= 0 ? "text-onetime-green" : "text-onetime-red"
                  }`}
                >
                  {userProfile.profit > 0 && "+"}
                  {userProfile.profit}U
                </p>
              </div>
            </div>

            {/* Graph container with no padding to ensure full width */}
            <div className="w-full -ml-0.5 pr-0.5">
              <BettorPerformanceGraph 
                data={userProfile.chartData} 
                timeframe={timeframe}
                isPositive={userProfile.profit >= 0}
                className="h-44" 
              />
            </div>
          </div>
        </div>

        {/* New Section: Biggest Wins from Tailing or Fading */}
        <div className="my-6 rounded-xl bg-black p-4 shadow-md border border-white/10">
          <h3 className="mb-4 text-xl font-bold text-white">Biggest Wins from Tailing or Fading</h3>
          
          {userProfile.tailingFadingWins.length > 0 ? (
            <div className="space-y-3">
              {userProfile.tailingFadingWins.map((win) => (
                <div key={win.id} className="rounded-lg bg-black/30 border border-white/10 p-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{win.bet}</span>
                    <span className="text-sm text-white/60">
                      {win.action === "tailed" ? "Tailed" : "Faded"} @{win.bettorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-onetime-green font-bold">+{win.unitsGained}U</span>
                    <span className="rounded-full bg-onetime-green px-2 py-0.5 text-xs font-medium text-onetime-dark">
                      {win.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-black/30 border border-white/10 p-6 text-center">
              <p className="text-white/70">No tailing or fading wins yet</p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
