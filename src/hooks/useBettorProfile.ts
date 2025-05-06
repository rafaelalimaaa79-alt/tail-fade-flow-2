
import { useState, useEffect } from "react";
import { fetchBettorSummary, fetchBettorHistory } from "@/services/bettorService";
import { BettorSummary, BettorBet } from "@/types/bettor";

type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y';

export const useBettorProfile = (bettorId: string) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1M');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<BettorSummary | null>(null);
  const [showLargestBets, setShowLargestBets] = useState(false);
  const [betHistory, setBetHistory] = useState<BettorBet[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
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
    setIsHistoryModalOpen
  };
};
