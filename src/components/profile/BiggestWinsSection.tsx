
import React from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
  // Find top bet all-time (by units gained)
  const topBet = [...wins].sort((a, b) => b.unitsGained - a.unitsGained)[0];
  
  const renderBetList = (bets: Win[], limit = 5) => {
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
                <p className="font-medium text-white">{bet.bet}</p>
                <p className="text-xs text-gray-400">+{Math.floor(Math.random() * 150 + 200)}</p>
              </div>
            </div>
            
            <div className="text-onetime-green font-bold">
              +{bet.unitsGained}U
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="my-6 rounded-xl bg-black border border-white/10 p-4 shadow-md">
      <div className="flex justify-center items-center">
        <h3 className="text-lg font-bold text-white">Biggest Bets</h3>
      </div>
      
      {wins.length > 0 ? (
        <>
          <Tabs defaultValue="winners" className="mt-2">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 rounded-full p-1 border border-white/10">
              <TabsTrigger value="winners" className="rounded-full">Biggest Winners</TabsTrigger>
              <TabsTrigger value="bets" className="rounded-full">Biggest Bets</TabsTrigger>
            </TabsList>
            <TabsContent value="winners">
              {renderBetList(wins)}
            </TabsContent>
            <TabsContent value="bets">
              {renderBetList(wins)}
            </TabsContent>
          </Tabs>
          
          <Button 
            variant="outline" 
            className="w-full mt-4 bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            View All Bets
          </Button>
        </>
      ) : (
        <div className="rounded-lg bg-black/30 border border-white/10 p-6 text-center mt-4">
          <p className="text-white/70">No wins yet</p>
        </div>
      )}
    </div>
  );
};

export default BiggestWinsSection;
