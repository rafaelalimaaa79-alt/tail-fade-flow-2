
import React from "react";
import { Bell } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ColdestBettors from "@/components/ColdestBettors";

const ColdPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="onetime-container pb-20">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-onetime-purple"></div>
            <h1 className="text-2xl font-bold">One Time</h1>
          </div>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Bell className="h-6 w-6" />
          </button>
        </header>

        <div className="mt-4">
          <h2 className="text-xl font-bold">Ice Cold Bettors</h2>
          <p className="mt-1 text-sm text-gray-500">
            Bettors on their worst losing streaks. Consider fading them.
          </p>
          
          <div className="mt-4">
            <ColdestBettors />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ColdPage;
