
import React from "react";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";
import { useNavigate } from "react-router-dom";

// Mock data - this would come from an API in a real app
const hottestBettors = [
  { id: "1", name: "Mike", profit: 1840, streak: [1, 1, 1, 1, 0] }, // 1=win, 0=loss
  { id: "2", name: "Sarah", profit: 1570, streak: [1, 1, 1, 0, 1] },
  { id: "3", name: "Chris", profit: 1320, streak: [1, 1, 0, 1, 1] },
  { id: "4", name: "Taylor", profit: 1180, streak: [0, 1, 1, 1, 1] },
  { id: "5", name: "Jordan", profit: 980, streak: [1, 0, 1, 1, 1] },
];

const HottestBettors = () => {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
      <div className="mb-4 flex items-center justify-center">
        <h3 className="text-lg font-bold text-white/90">On a Heater</h3>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto space-y-1">
        {hottestBettors.map((bettor) => (
          <BettorStreakItem
            key={bettor.id}
            id={bettor.id}
            name={bettor.name}
            profit={bettor.profit}
            streak={bettor.streak}
          />
        ))}
      </div>
      
      <ActionButton 
        variant="tail" 
        className="mt-4 h-10 text-sm"
        onClick={() => navigate("/leaders?type=hot")}
      >
        View Hottest Bettors
      </ActionButton>
    </div>
  );
};

export default HottestBettors;
