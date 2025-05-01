
import React from "react";
import { Link } from "react-router-dom";

type BettorStreakItemProps = {
  id: string;
  name: string;
  profit: number;
  streak: number[]; // 1 = win, 0 = loss
};

const BettorStreakItem = ({ id, name, profit, streak }: BettorStreakItemProps) => {
  const formattedProfit = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.abs(profit));
  
  return (
    <Link to={`/bettor/${id}`}>
      <div className="mb-3 flex items-center justify-between rounded-lg py-2 px-1 hover:bg-muted transition-colors">
        <div>
          <div className="font-medium text-white">{name}</div>
          <div className={`text-sm ${profit > 0 ? 'text-onetime-green' : 'text-onetime-red'}`}>
            {profit > 0 ? '+' : '-'}{formattedProfit}
          </div>
        </div>
        
        <div className="flex gap-[3px]">
          {streak.map((result, index) => (
            <div 
              key={index} 
              className={`h-5 w-5 rounded-sm ${result ? 'bg-onetime-green' : 'bg-onetime-red'} flex items-center justify-center text-[9px] font-bold text-white`}
            >
              {result ? 'W' : 'L'}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default BettorStreakItem;
