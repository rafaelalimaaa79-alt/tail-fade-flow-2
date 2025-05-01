
import React from "react";
import { Snowflake } from "lucide-react";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";

// Mock data - this would come from an API in a real app
const coldestBettors = [
  { id: "6", name: "Kevin", profit: -1650, streak: [0, 0, 0, 0, 1] }, // 1=win, 0=loss
  { id: "7", name: "Lisa", profit: -1490, streak: [0, 0, 0, 1, 0] },
  { id: "8", name: "Ryan", profit: -1250, streak: [1, 0, 0, 0, 0] },
  { id: "9", name: "Emily", profit: -1100, streak: [0, 1, 0, 0, 0] },
  { id: "10", name: "Alex", profit: -970, streak: [0, 0, 1, 0, 0] },
];

const ColdestBettors = () => {
  return (
    <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
      <div className="mb-4 flex items-center">
        <Snowflake className="mr-2 h-5 w-5 text-primary" />
        <h3 className="text-base font-bold text-white/90">Ice Cold</h3>
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
      
      <ActionButton variant="fade" className="mt-4 h-10 text-sm">
        Fade All
      </ActionButton>
    </div>
  );
};

export default ColdestBettors;
