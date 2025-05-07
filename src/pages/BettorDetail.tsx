
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BettorTimeFilter from "@/components/BettorTimeFilter";
import BetHistoryModal from "@/components/BetHistoryModal";
import { useBettorProfile } from "@/hooks/useBettorProfile";
import { Briefcase } from "lucide-react";

// Imported components
import BettorHeader from "@/components/bettor/BettorHeader";
import BettorStats from "@/components/bettor/BettorStats";
import BettorPerformanceSection from "@/components/bettor/BettorPerformanceSection";
import ViewBetHistoryButton from "@/components/bettor/ViewBetHistoryButton";
import BettorBetList from "@/components/BettorBetList";
import TodaysBets from "@/components/bettor/TodaysBets";

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
  
  if (loading && !summary) {
    return (
      <div className="onetime-container flex min-h-screen items-center justify-center bg-onetime-dark">
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
      <div className="onetime-container flex min-h-screen flex-col items-center justify-center bg-onetime-dark">
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
    <div className="bg-onetime-dark min-h-screen pb-20">
      <div className="onetime-container">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-16"
            />
          </div>
          <button 
            className="rounded-full p-2 text-white/80 hover:text-white"
            onClick={() => navigate('/portfolio')}
          >
            <Briefcase className="h-5 w-5" />
          </button>
        </header>
        
        {/* Bettor header with adjusted spacing */}
        <BettorHeader profile={summary.profile} />
        
        {/* Time filter on its own line with better spacing */}
        <div className="mb-4">
          <BettorTimeFilter
            activeFilter={timeframe}
            onChange={(newTimeframe) => setTimeframe(newTimeframe)}
            className="justify-start mt-2"
          />
        </div>
        
        {/* Today's Bets Section - HIGH PRIORITY */}
        <TodaysBets todayBets={todayBets} className="my-4" />
        
        <div className="my-4 rounded-xl bg-onetime-darkBlue p-4 shadow-md">
          {/* Performance Stats */}
          <BettorStats profile={summary.profile} />

          {/* Performance Graph */}
          <BettorPerformanceSection 
            summary={summary}
            timeframe={timeframe}
          />
        </div>
        
        {/* Best Bets Section with Tabs */}
        <BettorBetList
          biggestWinners={summary.biggestWinners}
          largestBets={summary.largestBets}
          className="my-4"
        />
        
        {/* View Bet History Button */}
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
    </div>
  );
};

export default BettorDetail;
