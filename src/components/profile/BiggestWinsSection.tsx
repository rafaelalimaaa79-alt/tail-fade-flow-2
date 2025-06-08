
import React from "react";

interface Win {
  id: string;
  bet: string;
  bettorName: string;
  action: string;
  unitsGained: number;
  outcome: string;
}

interface BiggestWinsSectionProps {
  wins: Win[];
}

const BiggestWinsSection: React.FC<BiggestWinsSectionProps> = ({ wins }) => {
  return (
    <div className="my-6 rounded-xl bg-black p-4 shadow-md border border-white/10">
      <h3 className="mb-4 text-xl font-bold text-white text-center">Biggest Losses this Month</h3>
      
      {wins.length > 0 ? (
        <div className="space-y-3">
          {wins.map((win) => (
            <div key={win.id} className="rounded-lg bg-black/30 border border-white/10 p-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium text-white">{win.bet}</span>
                <span className="text-sm text-white/60">
                  {win.action === "tailed" ? "Tailed" : "Faded"} @{win.bettorName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-onetime-green font-bold">+{win.unitsGained}U</span>
                <span className="rounded-full bg-onetime-green px-2 py-0.5 text-xs font-medium text-onetime-dark">
                  L
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-black/30 border border-white/10 p-6 text-center">
          <p className="text-white/70">No tailing or fading wins yet</p>
        </div>
      )}
    </div>
  );
};

export default BiggestWinsSection;
