
import React from "react";
import BettorStreakItem from "./BettorStreakItem";

// Mock data - this would come from an API in a real app
const coldestBettors = [
  { id: "6", name: "Kevin", profit: -1650, streak: [0, 0, 0, 0, 1] }, // 1=win, 0=loss
  { id: "7", name: "Lisa", profit: -1490, streak: [0, 0, 0, 1, 0] },
  { id: "8", name: "Ryan", profit: -1250, streak: [1, 0, 0, 0, 0] },
  { id: "9", name: "Emily", profit: -1100, streak: [0, 1, 0, 0, 0] },
  { id: "10", name: "Alex", profit: -970, streak: [0, 0, 1, 0, 0] },
  { id: "11", name: "Sam", profit: -890, streak: [0, 0, 0, 1, 1] },
  { id: "12", name: "Jordan", profit: -750, streak: [1, 0, 0, 0, 1] },
  { id: "13", name: "Casey", profit: -680, streak: [0, 1, 0, 1, 0] },
  { id: "14", name: "Morgan", profit: -550, streak: [0, 0, 1, 0, 1] },
  { id: "15", name: "Blake", profit: -420, streak: [1, 0, 1, 0, 0] },
];

const ColdestBettors = () => {
  return (
    <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
      <div className="mb-4 flex items-center justify-center">
        <h3 className="text-lg font-bold text-white/90">Ice Cold</h3>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto space-y-1">
        {coldestBettors.map((bettor) => (
          <BettorStreakItem
            key={bettor.id}
            id={bettor.id}
            name={bettor.name}
            profit={bettor.profit}
            streak={bettor.streak}
          />
        ))}
      </div>
    </div>
  );
};

export default ColdestBettors;
