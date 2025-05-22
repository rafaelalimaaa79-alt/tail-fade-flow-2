
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
      <div className="bg-black/30 p-3 rounded-xl border border-white/20 shadow-lg mb-6">
        <TabsList className="grid w-full grid-cols-2 rounded-xl overflow-hidden">
          <TabsTrigger 
            value="hot" 
            className="rounded-none py-3 border-r border-white/10 data-[state=active]:bg-onetime-green/20 data-[state=active]:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          >
            <span className="text-onetime-green font-bold font-rajdhani text-xl uppercase tracking-wider">
              Certified Wagons
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="cold" 
            className="rounded-none py-3 data-[state=active]:bg-onetime-red/20 data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          >
            <span className="text-onetime-red font-bold font-rajdhani text-xl uppercase tracking-wider">
              Walking L's
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="hot" className="space-y-2">
        {hotTabContent}
      </TabsContent>
      
      <TabsContent value="cold" className="space-y-2">
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
