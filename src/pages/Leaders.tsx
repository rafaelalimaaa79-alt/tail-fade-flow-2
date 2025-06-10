
import React, { useMemo } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TabsContainer from "@/components/leaders/TabsContainer";
import ProfileIcon from "@/components/common/ProfileIcon";
import { coldestBettors } from "@/components/leaders/mockData";

const Leaders = () => {
  const isMobile = useIsMobile();

  // Memoize the data to prevent unnecessary recalculations
  const memoizedColdestBettors = useMemo(() => coldestBettors, []);

  // Memoize the entire component output for optimal performance
  return useMemo(() => (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/15b68287-6284-47fd-b7cf-1c67129dec0b.png" 
            alt="Fade Zone logo" 
            className="h-32"
          />
          <ProfileIcon />
        </div>
        
        <TabsContainer
          activeTab="cold"
          onTabChange={() => {}}
          showAll={false}
          setShowAll={() => {}}
          hottestBettors={[]}
          coldestBettors={memoizedColdestBettors}
        />
      </div>
      <BottomNav />
    </div>
  ), [isMobile, memoizedColdestBettors]);
};

export default Leaders;

