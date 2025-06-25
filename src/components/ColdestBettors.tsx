
import React from "react";
import BettorStreakItem from "./BettorStreakItem";

// Mock data - this would come from an API in a real app
const coldestBettors = [
  { id: "6", name: "Kevin", profit: -165, streak: [0, 0, 0, 0, 1] }, // 1=win, 0=loss
  { id: "7", name: "Lisa", profit: -149, streak: [0, 0, 0, 1, 0] },
  { id: "8", name: "Ryan", profit: -125, streak: [1, 0, 0, 0, 0] },
  { id: "9", name: "Emily", profit: -110, streak: [0, 1, 0, 0, 0] },
  { id: "10", name: "Alex", profit: -21, streak: [0, 0, 0, 0, 0] },
  { id: "11", name: "Sam", profit: -19, streak: [0, 0, 0, 1, 0] },
  { id: "12", name: "Jordan", profit: -18, streak: [1, 0, 0, 0, 0] },
  { id: "13", name: "Casey", profit: -17, streak: [0, 1, 0, 0, 0] },
  { id: "14", name: "Taylor", profit: -16, streak: [0, 0, 1, 0, 0] },
  { id: "15", name: "Blake", profit: -42, streak: [1, 0, 1, 0, 0] },
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
