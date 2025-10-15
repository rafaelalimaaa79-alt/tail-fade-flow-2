
import React, { memo, useMemo } from "react";
import LeaderboardTable from "./LeaderboardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardUser {
  id: string;
  username: string;
  totalBets: number;
  winRate: number;
  roi: number;
  unitsGained: number;
  confidenceScore: number | null;
  statline: string | null;
  isCurrentUser: boolean;
}

interface TabsContainerProps {
  activeTab: "hot" | "cold";
  onTabChange: (value: string) => void;
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  hottestBettors: LeaderboardUser[];
  coldestBettors: LeaderboardUser[];
  loading?: boolean;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  onTabChange,
  hottestBettors,
  coldestBettors,
  loading = false,
}) => {
  // Memoize the content to prevent unnecessary renders
  const hotTabContent = useMemo(() => (
    <LeaderboardTable
      bettors={hottestBettors}
      showAll={false}
      setShowAll={() => {}}
      variant="fade"
      loading={loading}
    />
  ), [hottestBettors, loading]);

  const coldTabContent = useMemo(() => (
    <LeaderboardTable
      bettors={coldestBettors}
      showAll={false}
      setShowAll={() => {}}
      variant="fade"
      loading={loading}
    />
  ), [coldestBettors, loading]);

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-card/50 border border-white/10">
          <TabsTrigger
            value="hot"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-green-400/10 data-[state=active]:text-green-400 data-[state=active]:border-green-400/30"
          >
            🔥 Hottest Bettors
          </TabsTrigger>
          <TabsTrigger
            value="cold"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#AEE3F5]/20 data-[state=active]:to-[#AEE3F5]/10 data-[state=active]:text-[#AEE3F5] data-[state=active]:border-[#AEE3F5]/30"
          >
            ❄️ Coldest Bettors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hot" className="mt-0">
          <div className="mb-6 text-center bg-gradient-to-r from-green-500/10 to-green-400/5 rounded-xl border border-green-400/20 p-6">
            <h2 className="text-3xl font-bold font-exo text-green-400 uppercase tracking-wide mb-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]">
              Tail Leaderboard
            </h2>
            <p className="text-base text-white/70 font-medium">
              Top 10 Most Profitable Bettors
            </p>
          </div>

          <div className="space-y-2 animate-fade-in">
            {hotTabContent}
          </div>
        </TabsContent>

        <TabsContent value="cold" className="mt-0">
          <div className="mb-6 text-center bg-gradient-to-r from-[#AEE3F5]/10 to-[#AEE3F5]/5 rounded-xl border border-[#AEE3F5]/20 p-6">
            <h2 className="text-3xl font-bold font-exo text-[#AEE3F5] uppercase tracking-wide mb-2 drop-shadow-[0_0_8px_rgba(174,227,245,0.7)]">
              Fade Leaderboard
            </h2>
            <p className="text-base text-white/70 font-medium">
              Top 10 Worst Bettors
            </p>
          </div>

          <div className="space-y-2 animate-fade-in">
            {coldTabContent}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Use React.memo with a custom comparison function for optimal performance
export default memo(TabsContainer, (prevProps, nextProps) => {
  // Re-render if either hottestBettors or coldestBettors changes
  return prevProps.hottestBettors === nextProps.hottestBettors &&
         prevProps.coldestBettors === nextProps.coldestBettors &&
         prevProps.activeTab === nextProps.activeTab;
});
