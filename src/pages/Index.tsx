
import React from "react";
import { Bell } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import BetOfTheDay from "@/components/BetOfTheDay";
import HottestBettors from "@/components/HottestBettors";
import ColdestBettors from "@/components/ColdestBettors";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="onetime-container">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary neon-glow"></div>
            <h1 className="text-2xl font-bold neon-text">One Time</h1>
          </div>
          <button className="rounded-full p-2 text-white/80 hover:text-white">
            <Bell className="h-6 w-6" />
          </button>
        </header>

        <BetOfTheDay />
        
        <div className="mt-8 text-lg font-bold text-white/90">Leaderboard</div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <HottestBettors />
          <ColdestBettors />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
