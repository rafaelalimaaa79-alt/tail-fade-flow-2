
import React from "react";
import { BettorProfile } from "@/types/bettor";

type BettorStatsProps = {
  profile: BettorProfile;
};

const BettorStats: React.FC<BettorStatsProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-center">
        <p className="text-xs text-gray-400">Win Rate</p>
        <p className="text-lg font-bold text-white">{profile.stats.winRate}%</p>
      </div>
      <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-center">
        <p className="text-xs text-gray-400">ROI</p>
        <p
          className={`text-lg font-bold ${
            profile.stats.roi >= 0 ? "text-[#8FA3B0]" : "text-[#AEE3F5]"
          }`}
        >
          {profile.stats.roi > 0 && "+"}
          {profile.stats.roi}%
        </p>
      </div>
      <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-center">
        <p className="text-xs text-gray-400">Profit</p>
        <p
          className={`text-lg font-bold ${
            profile.stats.unitsGained >= 0 ? "text-[#8FA3B0]" : "text-[#AEE3F5]"
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
