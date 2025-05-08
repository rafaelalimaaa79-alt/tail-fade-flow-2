
import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import BriefcaseButton from "@/components/common/BriefcaseButton";
import { useNavigate } from "react-router-dom";
import TimeFilter from "@/components/TimeFilter";
import BetHistoryChart from "@/components/BetHistoryChart";
import BettorPerformanceGraph from "@/components/BettorPerformanceGraph";
import BettorTimeFilter from "@/components/BettorTimeFilter";
import { Badge } from "@/components/ui/badge";

// Mock data
const userProfile = {
  username: "BetterBettor",
  joinDate: "May 2024",
  winRate: 59,
  roi: 14.7,
  profit: 780,
  totalBets: 67,
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
  pendingBets: [
    {
      id: "1",
      timestamp: "2024-05-08T14:30:00Z",
      betType: "Lakers -4.5",
      teams: "Lakers vs Warriors",
      odds: "+110",
      unitsRisked: 3,
      result: "P",
      unitsWonLost: 0
    },
    {
      id: "2",
      timestamp: "2024-05-08T19:00:00Z",
      betType: "Yankees ML",
      teams: "Yankees vs Red Sox",
      odds: "-125",
      unitsRisked: 2,
      result: "P",
      unitsWonLost: 0
    }
  ],
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
    <div className="bg-onetime-dark min-h-screen pb-20">
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
          <BriefcaseButton className="mr-4" />
        </header>

        {/* User Header */}
        <div className="mb-2">
          <div className="flex items-center">
            <div className="flex flex-1 items-center justify-between">
              <div className="inline-block rounded-full bg-onetime-purple px-2 py-0.5">
                <span className="text-xs font-bold text-white">Joined {userProfile.joinDate}</span>
              </div>
              <h1 className="text-xl font-bold">@{userProfile.username}</h1>
            </div>
          </div>
        </div>

        {/* Pending Bets Section */}
        {userProfile.pendingBets.length > 0 ? (
          <div className="my-4 rounded-xl bg-onetime-darkBlue p-4 shadow-md">
            <h3 className="mb-4 text-xl font-bold text-white">Pending Bets</h3>
            <div className="space-y-4">
              {userProfile.pendingBets.map((bet) => {
                const confidence = bet.unitsRisked >= 5 
                  ? { label: "High", score: 85, color: "bg-onetime-green/20 text-onetime-green border-onetime-green/30" }
                  : bet.unitsRisked >= 3
                    ? { label: "Medium", score: 65, color: "bg-onetime-orange/20 text-onetime-orange border-onetime-orange/30" }
                    : { label: "Low", score: 40, color: "bg-white/10 text-white/80 border-white/20" };
                
                const potentialWin = parseFloat(bet.odds) > 0 
                  ? (bet.unitsRisked * parseFloat(bet.odds) / 100).toFixed(1)
                  : (bet.unitsRisked * 100 / Math.abs(parseFloat(bet.odds))).toFixed(1);
                
                return (
                  <div 
                    key={bet.id} 
                    className="relative overflow-hidden rounded-xl bg-gradient-to-r from-white/10 to-white/5 p-4 shadow-lg border border-white/10"
                  >
                    {/* Accent light effect */}
                    <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-onetime-purple/30 blur-xl"></div>
                    
                    {/* Top row: Bet Type as header & Time */}
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-white tracking-tight">{bet.betType}</h4>
                      <span className="text-xs text-white/60">
                        {new Date(bet.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {/* Middle row: Units and potential win */}
                    <div className="flex flex-wrap items-center justify-between mb-3">
                      <div className="text-sm text-white/80">
                        <span className="font-medium">{bet.unitsRisked} units to win {potentialWin}</span>
                      </div>
                      <Badge variant="outline" className={`border ${confidence.color}`}>
                        {confidence.score}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Performance Section with integrated stats */}
        <div className="my-4 rounded-xl bg-onetime-darkBlue p-4 shadow-md">
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
              <div className="rounded-lg bg-white/5 p-3 text-center">
                <p className="text-xs text-gray-400">Win Rate</p>
                <p className="text-lg font-bold text-white">{userProfile.winRate}%</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3 text-center">
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
              <div className="rounded-lg bg-white/5 p-3 text-center">
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
        <div className="my-6 rounded-xl bg-onetime-darkBlue p-4 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-white">Biggest Wins from Tailing or Fading</h3>
          
          {userProfile.tailingFadingWins.length > 0 ? (
            <div className="space-y-3">
              {userProfile.tailingFadingWins.map((win) => (
                <div key={win.id} className="rounded-lg bg-white/5 p-3 flex items-center justify-between">
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
            <div className="rounded-lg bg-white/5 p-6 text-center border border-white/10">
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
