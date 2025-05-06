
import React from "react";
import { BettorProfile } from "@/types/bettor";

type BettorStatsProps = {
  profile: BettorProfile;
};

const BettorStats: React.FC<BettorStatsProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="stat-card">
        <p className="text-xs text-gray-400">Win Rate</p>
        <p className="text-lg font-semibold text-white">{profile.stats.winRate}%</p>
      </div>
      <div className="stat-card">
        <p className="text-xs text-gray-400">ROI</p>
        <p
          className={`text-lg font-semibold ${
            profile.stats.roi >= 0 ? "text-onetime-green" : "text-onetime-red"
          }`}
        >
          {profile.stats.roi > 0 && "+"}
          {profile.stats.roi}%
        </p>
      </div>
      <div className="stat-card">
        <p className="text-xs text-gray-400">Profit</p>
        <p
          className={`text-lg font-semibold ${
            profile.stats.unitsGained >= 0 ? "text-onetime-green" : "text-onetime-red"
          }`}
        >
          {profile.stats.unitsGained > 0 && "+"}
          {profile.stats.unitsGained}U
        </p>
      </div>
    </div>
  );
};

export default BettorStats;
