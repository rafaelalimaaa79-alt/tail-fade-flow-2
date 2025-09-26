import React from "react";
import { BetSlip } from "@/types/betslips";
import BetSlipCard from "./BetSlipCard";

type BetSlipsListProps = {
  betSlips: BetSlip[];
};

const BetSlipsList = ({ betSlips }: BetSlipsListProps) => {
  if (betSlips.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No pending bet slips found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mx-auto">
      {betSlips.map((betSlip) => (
        <BetSlipCard key={betSlip.id} betSlip={betSlip} />
      ))}
    </div>
  );
};

export default BetSlipsList;