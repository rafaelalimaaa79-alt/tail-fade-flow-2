
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import TimeFilter from "@/components/TimeFilter";
import BetHistoryChart from "@/components/BetHistoryChart";
import ActionButton from "@/components/ActionButton";
import BottomNav from "@/components/BottomNav";

// Mock data
const mockBettorDetails = {
  "1": {
    id: "1",
    name: "FadeMaster",
    winRate: 68,
    roi: 22.5,
    streak: 6,
    profit: 1240,
    hot: true,
    averageBet: 50,
    totalBets: 128,
    chartData: [
      { date: "Mon", value: 100 },
      { date: "Tue", value: 120 },
      { date: "Wed", value: 180 },
      { date: "Thu", value: 150 },
      { date: "Fri", value: 200 },
      { date: "Sat", value: 250 },
      { date: "Sun", value: 280 },
    ],
    bets: [
      { id: "b1", sport: "NBA", pick: "Lakers -5.5", result: "Win", odds: "+110" },
      { id: "b2", sport: "NFL", pick: "Chiefs ML", result: "Win", odds: "-120" },
      { id: "b3", sport: "MLB", pick: "Yankees +1.5", result: "Win", odds: "-115" },
      { id: "b4", sport: "NBA", pick: "Celtics +3", result: "Loss", odds: "+105" },
      { id: "b5", sport: "NHL", pick: "Bruins -1.5", result: "Win", odds: "+150" },
    ],
  },
  "2": {
    id: "2",
    name: "BettingBaron",
    winRate: 54,
    roi: 12.1,
    streak: 3,
    profit: 580,
    hot: false,
    averageBet: 40,
    totalBets: 93,
    chartData: [
      { date: "Mon", value: 60 },
      { date: "Tue", value: 40 },
      { date: "Wed", value: 70 },
      { date: "Thu", value: 90 },
      { date: "Fri", value: 110 },
      { date: "Sat", value: 85 },
      { date: "Sun", value: 120 },
    ],
    bets: [
      { id: "b1", sport: "NFL", pick: "Bills +3", result: "Win", odds: "+100" },
      { id: "b2", sport: "NBA", pick: "Knicks ML", result: "Loss", odds: "+130" },
      { id: "b3", sport: "MLB", pick: "Dodgers -1.5", result: "Win", odds: "-110" },
      { id: "b4", sport: "NHL", pick: "Maple Leafs -1", result: "Win", odds: "-105" },
      { id: "b5", sport: "NBA", pick: "Warriors +5.5", result: "Loss", odds: "-115" },
    ],
  },
  "3": {
    id: "3",
    name: "SportsSage",
    winRate: 61,
    roi: -3.8,
    streak: -2,
    profit: -120,
    hot: false,
    averageBet: 65,
    totalBets: 112,
    chartData: [
      { date: "Mon", value: -20 },
      { date: "Tue", value: -50 },
      { date: "Wed", value: -30 },
      { date: "Thu", value: -60 },
      { date: "Fri", value: -90 },
      { date: "Sat", value: -70 },
      { date: "Sun", value: -120 },
    ],
    bets: [
      { id: "b1", sport: "NFL", pick: "Eagles -7", result: "Loss", odds: "-110" },
      { id: "b2", sport: "NBA", pick: "Heat +2.5", result: "Loss", odds: "-115" },
      { id: "b3", sport: "MLB", pick: "Astros ML", result: "Win", odds: "-130" },
      { id: "b4", sport: "NHL", pick: "Avalanche -1.5", result: "Loss", odds: "+140" },
      { id: "b5", sport: "NFL", pick: "Cowboys +3", result: "Loss", odds: "-105" },
    ],
  },
  "4": {
    id: "4",
    name: "OddsProphet",
    winRate: 72,
    roi: 31.5,
    streak: 8,
    profit: 1890,
    hot: true,
    averageBet: 80,
    totalBets: 145,
    chartData: [
      { date: "Mon", value: 200 },
      { date: "Tue", value: 250 },
      { date: "Wed", value: 300 },
      { date: "Thu", value: 280 },
      { date: "Fri", value: 320 },
      { date: "Sat", value: 400 },
      { date: "Sun", value: 450 },
    ],
    bets: [
      { id: "b1", sport: "NBA", pick: "Bucks -3.5", result: "Win", odds: "-110" },
      { id: "b2", sport: "NFL", pick: "49ers -6", result: "Win", odds: "-115" },
      { id: "b3", sport: "MLB", pick: "Braves ML", result: "Win", odds: "+120" },
      { id: "b4", sport: "NHL", pick: "Lightning +1.5", result: "Win", odds: "-140" },
      { id: "b5", sport: "NBA", pick: "Suns +4", result: "Win", odds: "-105" },
    ],
  },
};

const BettorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("1w");
  
  // Type guard to ensure we have a valid ID
  const bettorId = id || "1";
  const bettor = mockBettorDetails[bettorId as keyof typeof mockBettorDetails];
  
  if (!bettor) {
    return <div>Bettor not found</div>;
  }

  return (
    <>
      <div className="onetime-container">
        <div className="mb-4 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-2 rounded-full p-1 hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">{bettor.name}</h1>
          {bettor.hot && (
            <div className="ml-2 rounded-full bg-onetime-orange px-2 py-0.5">
              <span className="text-xs font-bold text-white">HOT</span>
            </div>
          )}
        </div>

        <TimeFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <div className="my-6 rounded-xl bg-white p-4 shadow-md">
          <div className="grid grid-cols-3 gap-2">
            <div className="stat-card">
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className="text-lg font-semibold">{bettor.winRate}%</p>
            </div>
            <div className="stat-card">
              <p className="text-xs text-gray-500">ROI</p>
              <p
                className={`text-lg font-semibold ${
                  bettor.roi >= 0 ? "text-onetime-green" : "text-onetime-red"
                }`}
              >
                {bettor.roi > 0 && "+"}
                {bettor.roi}%
              </p>
            </div>
            <div className="stat-card">
              <p className="text-xs text-gray-500">Profit</p>
              <p
                className={`text-lg font-semibold ${
                  bettor.profit >= 0 ? "text-onetime-green" : "text-onetime-red"
                }`}
              >
                {bettor.profit > 0 && "+"}${Math.abs(bettor.profit)}
              </p>
            </div>
          </div>

          <div className="my-6">
            <h3 className="mb-2 text-sm font-semibold">Performance</h3>
            <BetHistoryChart 
              data={bettor.chartData} 
              isPositive={bettor.profit >= 0} 
            />
          </div>

          <div className="mb-4 flex justify-between text-sm">
            <span className="text-gray-500">Average Bet: ${bettor.averageBet}</span>
            <span className="text-gray-500">Total Bets: {bettor.totalBets}</span>
          </div>
        </div>

        <div className="my-6">
          <h3 className="mb-3 text-lg font-bold">Recent Picks</h3>
          <div className="rounded-xl bg-white p-4 shadow-md">
            {bettor.bets.map((bet) => (
              <div 
                key={bet.id}
                className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{bet.pick}</p>
                  <p className="text-xs text-gray-500">{bet.sport} • {bet.odds}</p>
                </div>
                <span 
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    bet.result === "Win" 
                      ? "bg-green-100 text-onetime-green" 
                      : "bg-red-100 text-onetime-red"
                  }`}
                >
                  {bet.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-16 left-0 w-full px-4">
          <div className="flex gap-2">
            <ActionButton variant="tail">Tail</ActionButton>
            <ActionButton variant="fade">Fade</ActionButton>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default BettorDetail;
