
import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { triggerHaptic } from "@/utils/haptic-feedback";

type BettorProps = {
  id: string;
  name: string;
  winRate: number;
  roi: number;
  streak: number;
  profit: number;
  hot: boolean;
};

const BettorCard = ({
  id,
  name,
  winRate,
  roi,
  streak,
  profit,
  hot,
}: BettorProps) => {
  const isPositiveProfit = profit > 0;
  const streakType = streak > 0 ? "W" : "L";
  const absStreak = Math.abs(streak);

  return (
    <Link 
      to={`/bettor/${id}`} 
      className="block"
      onClick={() => triggerHaptic('impactLight')}
    >
      <div className="bettor-card mb-4">
        {hot && (
          <div className="absolute -right-6 -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-onetime-orange shadow-lg">
            <span className="mt-6 ml-2 text-xs font-bold text-white">HOT</span>
          </div>
        )}
        <div className="flex justify-between">
          <div>
            <h3 className="font-bold">@{name}</h3>
            <div className="mt-1 flex items-center text-sm">
              <span
                className={`mr-2 inline-block h-2 w-2 rounded-full ${
                  isPositiveProfit ? "bg-onetime-green" : "bg-onetime-red"
                }`}
              ></span>
              <span className="text-gray-500">
                {streakType}: {absStreak}
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="stat-card">
            <p className="text-xs text-gray-500">Win Rate</p>
            <p className="text-lg font-semibold">{winRate}%</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-gray-500">ROI</p>
            <p
              className={`text-lg font-semibold ${
                roi >= 0 ? "text-onetime-green" : "text-onetime-red"
              }`}
            >
              {roi > 0 && "+"}
              {roi}%
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-gray-500">Profit</p>
            <p
              className={`text-lg font-semibold ${
                profit >= 0 ? "text-onetime-green" : "text-onetime-red"
              }`}
            >
              {profit > 0 && "+"}${Math.abs(profit)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BettorCard;
