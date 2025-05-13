
import React, { memo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LeaderboardTable from "./LeaderboardTable";

interface BettorData {
  id: string;
  name: string;
  profit: number;
  winRate: number;
  streak: number;
}

interface TabsContainerProps {
  activeTab: "hot" | "cold";
  onTabChange: (value: string) => void;
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  hottestBettors: BettorData[];
  coldestBettors: BettorData[];
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  onTabChange,
  showAll,
  setShowAll,
  hottestBettors,
  coldestBettors,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="hot" className="relative">
          <span className="text-onetime-green text-base font-bold">
            Tail Leaders
          </span>
        </TabsTrigger>
        <TabsTrigger value="cold" className="relative">
          <span className="text-onetime-red text-base font-bold">
            Fade Leaders
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="hot" className="space-y-2">
        <LeaderboardTable 
          bettors={hottestBettors}
          showAll={showAll}
          setShowAll={setShowAll}
          variant="tail"
        />
      </TabsContent>
      
      <TabsContent value="cold" className="space-y-2">
        <LeaderboardTable 
          bettors={coldestBettors}
          showAll={showAll}
          setShowAll={setShowAll}
          variant="fade"
        />
      </TabsContent>
    </Tabs>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(TabsContainer);
