
import React from "react";
import PendingBetsList from "@/components/profile/PendingBetsList";

const PendingBetsSection: React.FC = () => {
  return (
    <div className="my-4 rounded-xl bg-black p-4 shadow-md relative animate-glow-pulse overflow-hidden border border-onetime-red/30">
      <div className="absolute inset-0 bg-onetime-red/5 pointer-events-none"></div>
      <div className="flex justify-center items-center">
        <h3 className="text-3xl font-bold text-[#AEE3F5] drop-shadow-[0_0_8px_rgba(174,227,245,0.7)] font-rajdhani uppercase tracking-wide">Pending Bets</h3>
      </div>
      <div className="relative z-10 mt-4">
        <PendingBetsList />
      </div>
    </div>
  );
};

export default PendingBetsSection;
