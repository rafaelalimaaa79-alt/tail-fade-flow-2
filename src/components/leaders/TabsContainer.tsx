
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
  hottestBettors,
  coldestBettors,
}) => {
  // Memoize the content of each tab to prevent unnecessary renders
  const hotTabContent = useMemo(() => (
    <LeaderboardTable 
      bettors={hottestBettors}
      showAll={false}
      setShowAll={() => {}}
      variant="fade"
    />
  ), [hottestBettors]);

  const coldTabContent = useMemo(() => (
    <LeaderboardTable 
      bettors={coldestBettors}
      showAll={false}
      setShowAll={() => {}}
      variant="fade"
    />
  ), [coldestBettors]);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full flex rounded-xl overflow-hidden bg-black/30 mb-6 p-0 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
        <TabsTrigger 
          value="hot" 
          className="flex-1 rounded-none py-3 border-r border-white/10 data-[state=active]:bg-[#FF5C5C]/20 data-[state=active]:shadow-[0_0_10px_rgba(255,92,92,0.5)] hover:bg-[#FF5C5C]/10 transition-all duration-300 group"
        >
          <span className="text-[#FF5C5C] font-bold font-rajdhani text-lg uppercase tracking-wide truncate px-1 group-hover:scale-105 transition-transform duration-200">
            Fade Bait
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="cold" 
          className="flex-1 rounded-none py-3 data-[state=active]:bg-onetime-red/20 data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:bg-onetime-red/10 transition-all duration-300 group"
        >
          <span className="text-onetime-red font-bold font-rajdhani text-lg uppercase tracking-wide truncate px-1 group-hover:scale-105 transition-transform duration-200">
            Walking L's
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="hot" className="space-y-2 animate-fade-in">
        {hotTabContent}
      </TabsContent>
      
      <TabsContent value="cold" className="space-y-2 animate-fade-in">
        {coldTabContent}
      </TabsContent>
    </Tabs>
  );
};

// Use React.memo with a custom comparison function for optimal performance
export default memo(TabsContainer, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return prevProps.activeTab === nextProps.activeTab &&
         prevProps.hottestBettors === nextProps.hottestBettors &&
         prevProps.coldestBettors === nextProps.coldestBettors;
});
