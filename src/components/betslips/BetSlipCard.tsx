import React from "react";
import { BetSlip } from "@/types/betslips";
import { Button } from "@/components/ui/button";

type BetSlipCardProps = {
  betSlip: BetSlip;
};

const BetSlipCard = ({ betSlip }: BetSlipCardProps) => {
  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getMainBet = () => {
    return betSlip.bets[0]; // Get the first bet for main display
  };

  const mainBet = getMainBet();
  const gameInfo = mainBet.event;

  return (
    <div className="bg-black rounded-xl p-4 border border-[#AEE3F5]/30 space-y-3 flex flex-col h-full">
      {/* Game Header */}
      <div className="text-center">
        <h3 className="text-[#AEE3F5] font-bold text-lg">
          {gameInfo.contestantAway.abbr} vs {gameInfo.contestantHome.abbr}
        </h3>
        <p className="text-gray-400 text-sm">{gameInfo.league}</p>
      </div>

      {/* Bet Info */}
      <div className="text-center space-y-1">
        <p className="text-white text-sm">
          {betSlip.book.name} • {betSlip.type.toUpperCase()}
        </p>
        <p className="text-gray-300 text-xs">
          {mainBet.bookDescription}
        </p>
      </div>

      {/* Stats */}
      <div className="text-center space-y-1 flex-grow">
        <p className="text-gray-400 text-xs">
          Odds: {formatOdds(betSlip.oddsAmerican)}
        </p>
        <p className="text-gray-400 text-xs">
          Risk: {formatCurrency(betSlip.atRisk)} • Win: {formatCurrency(betSlip.toWin)}
        </p>
        {betSlip.bets.length > 1 && (
          <p className="text-gray-400 text-xs">
            {betSlip.bets.length} leg {betSlip.type}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="flex justify-center py-1">
        <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
      </div>

      {/* Status */}
      <div className="text-center">
        <div className="bg-gray-800 rounded-lg px-3 py-2">
          <p className="text-[#AEE3F5] font-semibold text-sm capitalize">
            {betSlip.status}
          </p>
          <p className="text-gray-400 text-xs">
            Placed: {new Date(betSlip.timePlaced).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetSlipCard;