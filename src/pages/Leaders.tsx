
import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/leaders/PageHeader";
import TabsContainer from "@/components/leaders/TabsContainer";
import { hottestBettors, coldestBettors } from "@/components/leaders/mockData";

const Leaders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("type") === "fade" ? "cold" : "hot";
  const [activeTab, setActiveTab] = useState<"hot" | "cold">(defaultTab);
  const [showAll, setShowAll] = useState(false);
  const isMobile = useIsMobile();

  // Fix the infinite loop by using a ref to track first render
  const isFirstRender = React.useRef(true);
  
  useEffect(() => {
    // Skip URL update on the first render since we already set activeTab from URL
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Only update URL params when tab changes after the first render
    const newType = activeTab === "hot" ? "tail" : "fade";
    setSearchParams({ type: newType });
  }, [activeTab, setSearchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "hot" | "cold");
    setShowAll(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <PageHeader logoSrc="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" />
        
        <TabsContainer
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showAll={showAll}
          setShowAll={setShowAll}
          hottestBettors={hottestBettors}
          coldestBettors={coldestBettors}
        />
      </div>
      <BottomNav />
    </div>
  );
};

export default Leaders;
