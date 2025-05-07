import React, { useState } from "react";
import { User as UserIcon, Briefcase } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import TimeFilter from "@/components/TimeFilter";
import BetHistoryChart from "@/components/BetHistoryChart";
import { useNavigate } from "react-router-dom";

// Mock data
const userProfile = {
  username: "BetterBettor",
  joinDate: "May 2024",
  winRate: 59,
  roi: 14.7,
  profit: 780,
  totalBets: 67,
  chartData: [
    { date: "Jan", value: 120 },
    { date: "Feb", value: 200 },
    { date: "Mar", value: 150 },
    { date: "Apr", value: 300 },
    { date: "May", value: 400 },
  ],
  stats: {
    betsWon: 37,
    betsLost: 30,
    avgOdds: "+110",
    favorites: ["NBA", "NFL", "UFC"],
  },
};

const ProfilePage = () => {
  const [activeFilter, setActiveFilter] = useState("ytd");
  const navigate = useNavigate();

  return (
    <>
      <div className="onetime-container">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-20"
            />
          </div>
          <button 
            className="rounded-full p-2 text-white/80 hover:text-white"
            onClick={() => navigate('/portfolio')}
          >
            <Briefcase className="h-6 w-6" />
          </button>
        </header>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>

        <TimeFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <div className="my-6 rounded-xl bg-white p-4 shadow-md">
          <div className="grid grid-cols-3 gap-2">
            <div className="stat-card">
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className="text-lg font-semibold">{userProfile.winRate}%</p>
            </div>
            <div className="stat-card">
              <p className="text-xs text-gray-500">ROI</p>
              <p
                className={`text-lg font-semibold ${
                  userProfile.roi >= 0 ? "text-onetime-green" : "text-onetime-red"
                }`}
              >
                {userProfile.roi > 0 && "+"}
                {userProfile.roi}%
              </p>
            </div>
            <div className="stat-card">
              <p className="text-xs text-gray-500">Profit</p>
              <p
                className={`text-lg font-semibold ${
                  userProfile.profit >= 0 ? "text-onetime-green" : "text-onetime-red"
                }`}
              >
                {userProfile.profit > 0 && "+"}${Math.abs(userProfile.profit)}
              </p>
            </div>
          </div>

          <div className="my-6">
            <h3 className="mb-2 text-sm font-semibold">Performance</h3>
            <BetHistoryChart 
              data={userProfile.chartData} 
              isPositive={userProfile.profit >= 0} 
            />
          </div>
        </div>

        <div className="my-6">
          <h3 className="mb-3 text-lg font-bold">Betting Stats</h3>
          <div className="rounded-xl bg-white p-4 shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bets Won</p>
                <p className="text-lg font-medium text-onetime-green">
                  {userProfile.stats.betsWon}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bets Lost</p>
                <p className="text-lg font-medium text-onetime-red">
                  {userProfile.stats.betsLost}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bets</p>
                <p className="text-lg font-medium">
                  {userProfile.totalBets}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Odds</p>
                <p className="text-lg font-medium">
                  {userProfile.stats.avgOdds}
                </p>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500">Favorite Sports</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {userProfile.stats.favorites.map((sport) => (
                  <span 
                    key={sport}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium"
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default ProfilePage;
