
import React from "react";
import { Bell } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ColdestBettors from "@/components/ColdestBettors";

const ColdPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="onetime-container">
        <header className="mb-8 flex items-center justify-between">
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

        <div className="mt-4">
          <h2 className="text-xl font-bold text-white/90">Ice Cold Bettors</h2>
          <p className="mt-2 text-sm text-white/60">
            Bettors on their worst losing streaks. Consider fading them.
          </p>
          
          <div className="mt-6">
            <ColdestBettors />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ColdPage;
