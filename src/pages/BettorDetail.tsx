
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ArrowRight, List } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import BettorTimeFilter from "@/components/BettorTimeFilter";
import BettorPerformanceGraph from "@/components/BettorPerformanceGraph";
import BettorBetList from "@/components/BettorBetList";
import BetHistoryModal from "@/components/BetHistoryModal";
import { useBettorProfile } from "@/hooks/useBettorProfile";
import { Button } from "@/components/ui/button";

const BettorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
            onClick={() => navigate(-1)}
            className="rounded-md bg-onetime-purple px-4 py-2 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const { profile, graphData, biggestWinners, largestBets } = summary;
  const isPositivePerformance = profile.stats.unitsGained >= 0;
  
  return (
    <>
      <div className="onetime-container pb-20">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-2 rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">@{profile.username}</h1>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-onetime-purple px-2 py-0.5">
                  <span className="text-xs font-bold text-white">#{profile.tailRanking} Tail Ranking</span>
                </div>
                <Link 
                  to="/leaders" 
                  className="flex items-center text-xs text-onetime-purple"
                >
                  View Full Rankings
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <BettorTimeFilter
          activeFilter={timeframe}
          onChange={(newTimeframe) => setTimeframe(newTimeframe)}
          className="my-4"
        />
        
        <div className="my-6 rounded-xl bg-white p-4 shadow-md">
          <div className="grid grid-cols-3 gap-2">
            <div className="stat-card">
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className="text-lg font-semibold">{profile.stats.winRate}%</p>
            </div>
            <div className="stat-card">
              <p className="text-xs text-gray-500">ROI</p>
              <p
                className={`text-lg font-semibold ${
                  profile.stats.roi >= 0 ? "text-onetime-green" : "text-onetime-red"
                }`}
              >
                {profile.stats.roi > 0 && "+"}
                {profile.stats.roi}%
              </p>
            </div>
            <div className="stat-card">
              <p className="text-xs text-gray-500">Profit</p>
              <p
                className={`text-lg font-semibold ${
                  profile.stats.unitsGained >= 0 ? "text-onetime-green" : "text-onetime-red"
                }`}
              >
                {profile.stats.unitsGained > 0 && "+"}
                {profile.stats.unitsGained}U
              </p>
            </div>
          </div>

          <div className="my-6">
            <h3 className="mb-2 text-sm font-semibold">Performance</h3>
            <BettorPerformanceGraph 
              data={graphData.data} 
              timeframe={timeframe}
              isPositive={isPositivePerformance} 
            />
          </div>

          <div className="mb-4 flex justify-between text-sm">
            <span className="text-gray-500">Total Bets: {profile.stats.totalBets}</span>
          </div>
        </div>
        
        <BettorBetList
          biggestWinners={biggestWinners}
          largestBets={largestBets}
          showLargestBets={showLargestBets}
          onToggleChange={setShowLargestBets}
          className="my-6"
        />
        
        <Button 
          onClick={() => setIsHistoryModalOpen(true)}
          variant="outline"
          className="mt-4 w-full border-onetime-purple py-6 text-onetime-purple hover:bg-onetime-purple hover:text-white"
        >
          <List className="mr-2 h-5 w-5" />
          View Bet History
        </Button>
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
