
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { calculateBetLine, getMatchupInfo } from "@/utils/betLineParser";
import {
  getCurrentUserPendingBets,
  getCurrentUserConfidenceScore,
  BetRecord
} from "@/services/userDataService";

const SPORTSBOOKS = {
  "hardrock": {
    name: "Hard Rock",
    appUrl: "https://hardrock.betmgm.com/"
  },
  "fanduel": {
    name: "FanDuel",
    appUrl: "https://sportsbook.fanduel.com/"
  },
  "draftkings": {
    name: "DraftKings",
    appUrl: "https://sportsbook.draftkings.com/"
  }
};

const DEFAULT_SPORTSBOOK = "hardrock";

const PendingBetsList = () => {
  const [showAll, setShowAll] = useState(false);
  const [pendingBets, setPendingBets] = useState<BetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [confidenceData, setConfidenceData] = useState<{ score: number; statline: string } | null>(null);

  // Fetch real pending bets from database using helper functions
  useEffect(() => {
    const fetchPendingBets = async () => {
      try {
        // Fetch pending bets using helper
        const bets = await getCurrentUserPendingBets();

        // Fetch confidence score using helper
        const confidence = await getCurrentUserConfidenceScore();

        setPendingBets(bets);
        setConfidenceData(confidence);
      } catch (error) {
        console.error("Error fetching pending bets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBets();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg bg-black p-6 text-center border border-white/10">
        <p className="text-gray-400">Loading pending bets...</p>
      </div>
    );
  }

  if (pendingBets.length === 0) {
    return (
      <div className="rounded-lg bg-black p-6 text-center border border-white/10">
        <p className="text-gray-400">You don't have any pending bets yet</p>
      </div>
    );
  }

  const handleBetNow = (sportsbook = DEFAULT_SPORTSBOOK) => {
    // Open the sportsbook in a new tab
    window.open(SPORTSBOOKS[sportsbook as keyof typeof SPORTSBOOKS]?.appUrl || SPORTSBOOKS[DEFAULT_SPORTSBOOK].appUrl, '_blank');
  };

  // Use backend confidence score
  const fadeConfidence = confidenceData?.score ?? 75;

  // Determine which bets to show
  const betsToShow = showAll ? pendingBets : pendingBets.slice(0, 3);
  const hasMoreBets = pendingBets.length > 3;
  
  return (
    <div className="space-y-4">
      {betsToShow.map((bet, index) => {
        // Calculate bet lines from database record
        const betLine = calculateBetLine(bet);
        const matchup = getMatchupInfo(bet);

        return (
          <div key={bet.id}>
            <div
              className="bg-black rounded-xl p-3 border border-[#AEE3F5]/30 animate-glow-pulse space-y-2"
              style={{
                boxShadow: '0 0 15px rgba(174, 227, 245, 0.3)',
              }}
            >
              {/* Game header with solid icy blue underline */}
              <div className="text-center pb-1">
                <h3 className="text-base font-bold text-white relative inline-block">
                  {matchup.game}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#AEE3F5] opacity-90"></div>
                </h3>
              </div>

              {/* Your pending bet description */}
              <div className="text-center">
                <p className="text-base font-bold">
                  <span className="text-white">Your Bet: </span>
                  <span className="text-[#AEE3F5]">{betLine}</span>
                </p>
              </div>

              {/* Divider line */}
              <div className="flex justify-center py-1">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
              </div>

              {/* Statline from backend */}
              {confidenceData?.statline && (
                <div className="text-center">
                  <p className="text-sm text-gray-400 italic">
                    {confidenceData.statline}
                  </p>
                </div>
              )}

              {/* Fade confidence */}
              <div className="text-center">
                <p className="text-base font-semibold text-gray-300">
                  Fade Confidence: <span className="text-[#AEE3F5] font-bold">{Math.round(fadeConfidence)}%</span>
                </p>
              </div>

              {/* Bet button */}
              <div className="w-full pt-1">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-xl"
                  onClick={() => handleBetNow()}
                  style={{
                    boxShadow: "0 0 20px rgba(108, 92, 231, 0.8), 0 0 40px rgba(108, 92, 231, 0.4)"
                  }}
                >
                  Bet Now on Hard Rock
                </Button>
              </div>
            </div>
            
            {/* Separator line between cards (not after the last one) */}
            {index < betsToShow.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-3/4 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/50 to-transparent"></div>
              </div>
            )}
          </div>
        );
      })}
      
      {/* View All / Show Less Button - More Prominent */}
      {hasMoreBets && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={() => setShowAll(!showAll)}
            className="bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold py-3 px-8 text-lg rounded-xl shadow-lg"
            style={{
              boxShadow: "0 0 20px rgba(174, 227, 245, 0.6), 0 0 40px rgba(174, 227, 245, 0.3)"
            }}
          >
            {showAll ? `Show Top 3 Bets` : `View All ${pendingBets.length} Pending Bets`}
            {!showAll && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PendingBetsList;
