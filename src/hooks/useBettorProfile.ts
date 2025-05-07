import { useState, useEffect } from "react";
import { 
  fetchBettorSummary, 
  fetchBettorHistory, 
  fetchBettorActivity,
  TimeFrame 
} from "@/services/bettorService";
import { BettorSummary, BettorBet } from "@/types/bettor";

export const useBettorProfile = (bettorId: string) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1M');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<BettorSummary | null>(null);
  const [showLargestBets, setShowLargestBets] = useState(false);
  const [betHistory, setBetHistory] = useState<BettorBet[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [todayBets, setTodayBets] = useState<BettorBet[]>([]);
  const [pendingBets, setPendingBets] = useState<BettorBet[]>([]);
  const [upcomingBets, setUpcomingBets] = useState<BettorBet[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  
  // Fetch bettor summary when timeframe changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetchBettorSummary(bettorId, timeframe)
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching bettor summary:", err);
        setError("Failed to load bettor data");
        setLoading(false);
      });
  }, [bettorId, timeframe]);
  
  // Fetch bet history when modal is opened
  useEffect(() => {
    if (isHistoryModalOpen) {
      setLoading(true);
      
      fetchBettorHistory(bettorId, timeframe)
        .then(data => {
          setBetHistory(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching bet history:", err);
          setError("Failed to load bet history");
          setLoading(false);
        });
    }
  }, [bettorId, timeframe, isHistoryModalOpen]);
  
  // Fetch bettor activity when component mounts
  useEffect(() => {
    setActivityLoading(true);
    
    fetchBettorActivity(bettorId)
      .then(data => {
        setTodayBets(data.todayBets);
        setPendingBets(data.pendingBets);
        setUpcomingBets(data.upcomingBets);
        setActivityLoading(false);
      })
      .catch(err => {
        console.error("Error fetching bettor activity:", err);
        setActivityLoading(false);
      });
  }, [bettorId]);
  
  return {
    timeframe,
    setTimeframe,
    loading,
    error,
    summary,
    showLargestBets,
    setShowLargestBets,
    betHistory,
    isHistoryModalOpen,
    setIsHistoryModalOpen,
    todayBets,
    pendingBets,
    upcomingBets,
    activityLoading
  };
};
