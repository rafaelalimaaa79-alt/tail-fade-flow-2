
import React, { memo, useMemo } from "react";
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
  coldestBettors,
}) => {
  // Memoize the content to prevent unnecessary renders
  const coldTabContent = useMemo(() => (
    <LeaderboardTable 
      bettors={coldestBettors}
      showAll={false}
      setShowAll={() => {}}
      variant="fade"
    />
  ), [coldestBettors]);

  return (
    <div className="w-full">
      <div className="mb-6 text-center bg-gradient-to-r from-[#AEE3F5]/10 to-[#AEE3F5]/5 rounded-xl border border-[#AEE3F5]/20 p-6">
        <h2 className="text-3xl font-bold font-rajdhani text-[#AEE3F5] uppercase tracking-wide mb-2">
          Fade Leaderboard
        </h2>
        <p className="text-sm text-white/70 font-medium">
          This Week's Worst Bettors
        </p>
      </div>
      
      <div className="space-y-2 animate-fade-in">
        {coldTabContent}
      </div>
    </div>
  );
};

// Use React.memo with a custom comparison function for optimal performance
export default memo(TabsContainer, (prevProps, nextProps) => {
  // Only re-render if coldestBettors changes
  return prevProps.coldestBettors === nextProps.coldestBettors;
});
