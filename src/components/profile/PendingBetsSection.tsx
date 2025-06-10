
import React from "react";
import PendingBetsList from "@/components/profile/PendingBetsList";

const PendingBetsSection: React.FC = () => {
  return (
    <div className="my-4 rounded-xl bg-black p-4 shadow-md relative animate-glow-pulse-purple overflow-hidden border border-onetime-purple/30">
      <div className="absolute inset-0 bg-onetime-purple/5 pointer-events-none"></div>
      <div className="flex justify-center items-center">
        <h3 className="text-lg font-bold text-white">Pending Bets</h3>
      </div>
      <div className="relative z-10 mt-4">
        <PendingBetsList />
      </div>
    </div>
  );
};

export default PendingBetsSection;
