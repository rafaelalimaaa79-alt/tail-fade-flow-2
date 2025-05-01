
import React from "react";
import { Bell } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import BetOfTheDay from "@/components/BetOfTheDay";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="onetime-container">
        <header className="mb-2 flex items-center justify-between">
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

        <BetOfTheDay />
        
        <div className="mt-4">
          <LeaderboardCarousel />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
