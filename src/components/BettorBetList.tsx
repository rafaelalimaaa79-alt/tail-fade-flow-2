
import React from "react";
import { BettorBet } from "@/types/bettor";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BettorBetListProps = {
  biggestWinners: BettorBet[];
  largestBets: BettorBet[];
  className?: string;
};

const BettorBetList: React.FC<BettorBetListProps> = ({
  biggestWinners,
  largestBets,
  className
}) => {
  // Find top bet all-time (by units won)
  const topBet = [...biggestWinners].sort((a, b) => b.unitsWonLost - a.unitsWonLost)[0];
  
  const renderBetList = (bets: BettorBet[], limit = 5) => {
    // Limit to top bets
    const topBets = bets.slice(0, limit);
    
    return (
      <div className="space-y-3 mt-4">
        {topBets.map((bet, index) => (
          <div 
            key={bet.id}
            className="flex items-center justify-between border-b border-gray-700 pb-2 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-white">{bet.betType}</p>
                <p className="text-xs text-gray-400">{bet.odds}</p>
              </div>
            </div>
            
            <div className={cn(
              "font-bold",
              bet.unitsWonLost > 0 ? "text-[#C4D7DC]" : "text-[#AEE3F5]"
            )}>
              {bet.unitsWonLost > 0 ? '+' : ''}{bet.unitsWonLost}U
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={cn("rounded-xl bg-black border border-white/10 p-4 shadow-md", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Best Bets</h3>
        
        {topBet && (
          <div className="text-xs text-gray-400">
            <span>Top Bet: </span>
            <span className={cn(
              "font-medium",
              topBet.unitsWonLost > 0 ? "text-[#C4D7DC]" : "text-[#AEE3F5]"
            )}>
              {topBet.unitsWonLost > 0 ? '+' : ''}{topBet.unitsWonLost}U {topBet.betType}
            </span>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="winners" className="mt-2">
        <TabsList className="grid w-full grid-cols-2 bg-black/50">
          <TabsTrigger value="winners">Biggest Winners</TabsTrigger>
          <TabsTrigger value="largest">Largest Bets</TabsTrigger>
        </TabsList>
        <TabsContent value="winners">
          {renderBetList(biggestWinners)}
        </TabsContent>
        <TabsContent value="largest">
          {renderBetList(largestBets)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BettorBetList;
