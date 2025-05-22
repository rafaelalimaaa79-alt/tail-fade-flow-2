
import React from "react";
import PendingBetsList from "@/components/profile/PendingBetsList";

const PendingBetsSection: React.FC = () => {
  return (
    <div className="my-4 rounded-xl bg-black p-4 shadow-md relative animate-glow-pulse-purple overflow-hidden border border-onetime-purple/30">
      <div className="absolute inset-0 bg-onetime-purple/5 backdrop-blur-sm pointer-events-none"></div>
      <h3 className="mb-4 text-xl font-bold text-white relative z-10">Pending Bets</h3>
      <div className="relative z-10">
        <PendingBetsList />
      </div>
    </div>
  );
};

export default PendingBetsSection;
