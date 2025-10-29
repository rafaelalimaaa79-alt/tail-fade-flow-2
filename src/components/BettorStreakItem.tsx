
import React from "react";
import { Link } from "react-router-dom";

type BettorStreakItemProps = {
  id: string;
  name: string;
  profit: number;
  streak: number[]; // 1 = win, 0 = loss
};

const BettorStreakItem = ({ id, name, profit, streak }: BettorStreakItemProps) => {
  const formattedProfit = Math.abs(profit);

  return (
    <div className="mb-3 flex items-center justify-between rounded-lg py-2 px-1 hover:bg-muted transition-colors">
      <div>
        <div className="font-medium text-white">@{name}</div>
        <div className={`text-sm ${profit > 0 ? 'text-[#C4D7DC]' : 'text-[#AEE3F5]'}`}>
          {profit > 0 ? '+' : '-'}{formattedProfit} Units
        </div>
      </div>

      <div className="flex gap-[3px]">
        {streak.map((result, index) => (
          <div
            key={index}
            className={`h-5 w-5 rounded-sm ${result ? 'bg-black text-white border border-[#AEE3F5]' : 'bg-[#AEE3F5] text-black'} flex items-center justify-center text-[9px] font-bold`}
          >
            {result ? 'W' : 'L'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BettorStreakItem;
