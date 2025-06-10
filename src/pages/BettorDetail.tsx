

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BetHistoryModal from "@/components/BetHistoryModal";
import { useBettorProfile } from "@/hooks/useBettorProfile";
import { useNotificationStore } from "@/utils/betting-notifications";
import FullscreenNotification from "@/components/FullscreenNotification";
import ProfileIcon from "@/components/common/ProfileIcon";

// Imported components
import BettorHeader from "@/components/bettor/BettorHeader";
import BettorPerformanceSection from "@/components/bettor/BettorPerformanceSection";
import BettorBetList from "@/components/BettorBetList";
import PendingBets from "@/components/bettor/PendingBets";

const BettorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    timeframe,
    setTimeframe,
    loading,
    error,
    summary,
    betHistory,
    isHistoryModalOpen,
    setIsHistoryModalOpen,
    todayBets,
    pendingBets,
    upcomingBets,
    activityLoading
  } = useBettorProfile(id || "1");
  
  // Notification store
  const { isOpen, variant, bettorName, betDescription, closeNotification } = useNotificationStore();
  
  if (loading && !summary) {
    return (
      <div className="onetime-container flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-onetime-purple border-t-transparent"></div>
          </div>
          <p className="text-gray-300">Loading bettor profile...</p>
        </div>
      </div>
    );
  }
  
  if (error || !summary) {
    return (
      <div className="onetime-container flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-red-500">Error</h1>
          <p className="mb-4 text-gray-300">{error || "Failed to load bettor profile"}</p>
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
    <div className="bg-black min-h-screen pb-20">
      <div className="max-w-md mx-auto w-full px-2">
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/15b68287-6284-47fd-b7cf-1c67129dec0b.png" 
            alt="Fade Zone logo" 
            className="h-32"
          />
          <div className="flex items-center gap-2">
            <ProfileIcon />
          </div>
        </div>
        
        {/* Bettor header with improved styling and organization */}
        <BettorHeader profile={summary.profile} />
        
        {/* Pending Bets Section */}
        <PendingBets pendingBets={pendingBets} profile={summary.profile} className="my-4" />
        
        <div className="my-4 rounded-xl bg-black border border-white/10 p-4 shadow-md">
          {/* Performance Section */}
          <BettorPerformanceSection 
            summary={summary}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
        </div>
        
        {/* Best Bets Section */}
        <BettorBetList
          biggestWinners={summary.biggestWinners}
          largestBets={summary.largestBets}
          className="my-4"
        />
      </div>
      
      {/* Keep existing modal and notification components */}
      <BetHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        bets={betHistory}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        isLoading={loading}
      />
      
      <FullscreenNotification
        message=""
        isOpen={isOpen}
        variant={variant || "tail"}
        onClose={closeNotification}
        bettorName={bettorName}
        betDescription={betDescription}
      />
      
      <BottomNav />
    </div>
  );
};

export default BettorDetail;

