
import React from "react";
import { useParams } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BettorTimeFilter from "@/components/BettorTimeFilter";
import BettorBetList from "@/components/BettorBetList";
import BetHistoryModal from "@/components/BetHistoryModal";
import { useBettorProfile } from "@/hooks/useBettorProfile";

// Imported components
import BettorHeader from "@/components/bettor/BettorHeader";
import BettorStats from "@/components/bettor/BettorStats";
import BettorPerformanceSection from "@/components/bettor/BettorPerformanceSection";
import ViewBetHistoryButton from "@/components/bettor/ViewBetHistoryButton";

const BettorDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    timeframe,
    setTimeframe,
    loading,
    error,
    summary,
    showLargestBets,
    setShowLargestBets,
    betHistory,
    isHistoryModalOpen,
    setIsHistoryModalOpen
  } = useBettorProfile(id || "1");
  
  if (loading && !summary) {
    return (
      <div className="onetime-container flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-onetime-purple border-t-transparent"></div>
          </div>
          <p className="text-gray-600">Loading bettor profile...</p>
        </div>
      </div>
    );
  }
  
  if (error || !summary) {
    return (
      <div className="onetime-container flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-red-500">Error</h1>
          <p className="mb-4 text-gray-600">{error || "Failed to load bettor profile"}</p>
          <button 
            onClick={() => window.history.back()}
            className="rounded-md bg-onetime-purple px-4 py-2 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="onetime-container pb-20">
        <BettorHeader profile={summary.profile} />
        
        <BettorTimeFilter
          activeFilter={timeframe}
          onChange={(newTimeframe) => setTimeframe(newTimeframe)}
          className="my-4"
        />
        
        <div className="my-6 rounded-xl bg-white p-4 shadow-md">
          <BettorStats profile={summary.profile} />

          <BettorPerformanceSection 
            summary={summary}
            timeframe={timeframe}
          />
        </div>
        
        <BettorBetList
          biggestWinners={summary.biggestWinners}
          largestBets={summary.largestBets}
          showLargestBets={showLargestBets}
          onToggleChange={setShowLargestBets}
          className="my-6"
        />
        
        <ViewBetHistoryButton onClick={() => setIsHistoryModalOpen(true)} />
      </div>
      
      <BetHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        bets={betHistory}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        isLoading={loading}
      />
      
      <BottomNav />
    </>
  );
};

export default BettorDetail;
