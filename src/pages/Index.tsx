
import React, { useState } from "react";
import { Bell } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import TimeFilter from "@/components/TimeFilter";
import BettorCard from "@/components/BettorCard";

// Mock data
const mockBettors = [
  {
    id: "1",
    name: "FadeMaster",
    winRate: 68,
    roi: 22.5,
    streak: 6,
    profit: 1240,
    hot: true,
  },
  {
    id: "2",
    name: "BettingBaron",
    winRate: 54,
    roi: 12.1,
    streak: 3,
    profit: 580,
    hot: false,
  },
  {
    id: "3",
    name: "SportsSage",
    winRate: 61,
    roi: -3.8,
    streak: -2,
    profit: -120,
    hot: false,
  },
  {
    id: "4",
    name: "OddsProphet",
    winRate: 72,
    roi: 31.5,
    streak: 8,
    profit: 1890,
    hot: true,
  },
];

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("today");

  return (
    <>
      <div className="onetime-container">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">One Time</h1>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Bell className="h-6 w-6" />
          </button>
        </div>

        <TimeFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <div className="my-6">
          <h2 className="mb-3 text-lg font-bold">Trending Bettors</h2>
          {mockBettors.map((bettor) => (
            <BettorCard key={bettor.id} {...bettor} />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Dashboard;
