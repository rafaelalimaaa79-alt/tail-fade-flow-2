
import React, { memo, useMemo } from "react";
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
  // Memoize the content of each tab to prevent unnecessary renders
  const hotTabContent = useMemo(() => (
    <LeaderboardTable 
      bettors={hottestBettors}
      showAll={showAll}
      setShowAll={setShowAll}
      variant="tail"
    />
  ), [hottestBettors, showAll, setShowAll]);

  const coldTabContent = useMemo(() => (
    <LeaderboardTable 
      bettors={coldestBettors}
      showAll={showAll}
      setShowAll={setShowAll}
      variant="fade"
    />
  ), [coldestBettors, showAll, setShowAll]);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 rounded-xl bg-black/20 p-1 border border-white/10">
        <TabsTrigger 
          value="hot" 
          className="rounded-lg py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-md"
        >
          <span className="text-onetime-green font-bold font-rajdhani text-lg uppercase tracking-wide">
            Certified Wagons
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="cold" 
          className="rounded-lg py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-md"
        >
          <span className="text-onetime-red font-bold font-rajdhani text-lg uppercase tracking-wide">
            Walking L's
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="hot" className="mt-6 space-y-2">
        {hotTabContent}
      </TabsContent>
      
      <TabsContent value="cold" className="mt-6 space-y-2">
        {coldTabContent}
      </TabsContent>
    </Tabs>
  );
};

// Use React.memo with a custom comparison function for optimal performance
export default memo(TabsContainer, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return prevProps.activeTab === nextProps.activeTab &&
         prevProps.showAll === nextProps.showAll &&
         prevProps.hottestBettors === nextProps.hottestBettors &&
         prevProps.coldestBettors === nextProps.coldestBettors;
});
