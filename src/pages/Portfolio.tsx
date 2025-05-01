
import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import TimeFilter from "@/components/TimeFilter";
import BettorCard from "@/components/BettorCard";
import { Bell } from "lucide-react";

// Mock data
const mockPortfolio = {
  tailing: [
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
      id: "4",
      name: "OddsProphet",
      winRate: 72,
      roi: 31.5,
      streak: 8,
      profit: 1890,
      hot: true,
    },
  ],
  fading: [
    {
      id: "3",
      name: "SportsSage",
      winRate: 61,
      roi: -3.8,
      streak: -2,
      profit: -120,
      hot: false,
    },
  ],
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("1w");
  const [activeTab, setActiveTab] = useState<"tailing" | "fading">("tailing");

  return (
    <>
      <div className="onetime-container">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-14"
            />
          </div>
          <button className="rounded-full p-2 text-white/80 hover:text-white">
            <Bell className="h-6 w-6" />
          </button>
        </header>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Portfolio</h1>
        </div>

        <TimeFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Portfolio tabs */}
        <div className="mb-6 mt-4 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
          <button
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              activeTab === "tailing"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("tailing")}
          >
            Tailing ({mockPortfolio.tailing.length})
          </button>
          <button
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              activeTab === "fading"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("fading")}
          >
            Fading ({mockPortfolio.fading.length})
          </button>
        </div>

        {/* Portfolio content */}
        <div className="min-h-[60vh]">
          {activeTab === "tailing" && (
            <div>
              {mockPortfolio.tailing.length > 0 ? (
                mockPortfolio.tailing.map((bettor) => (
                  <BettorCard key={bettor.id} {...bettor} />
                ))
              ) : (
                <div className="mt-12 text-center text-gray-500">
                  <p>You're not tailing any bettors yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "fading" && (
            <div>
              {mockPortfolio.fading.length > 0 ? (
                mockPortfolio.fading.map((bettor) => (
                  <BettorCard key={bettor.id} {...bettor} />
                ))
              ) : (
                <div className="mt-12 text-center text-gray-500">
                  <p>You're not fading any bettors yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Portfolio;
