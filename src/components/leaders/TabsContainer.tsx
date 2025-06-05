
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
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold font-rajdhani text-[#AEE3F5] uppercase tracking-wide">
          Walking L's
        </h2>
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
