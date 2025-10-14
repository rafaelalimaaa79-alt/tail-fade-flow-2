
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { calculateBetLine, getMatchupInfo } from "@/utils/betLineParser";
import {
  getCurrentUserPendingBets,
  getCurrentUserConfidenceScore,
  calculateBetStatline,
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

interface BetWithStatline extends BetRecord {
  statline: string;
  fadeConfidence: number;
}

const PendingBetsList = () => {
  const [showAll, setShowAll] = useState(false);
  const [betsWithStatlines, setBetsWithStatlines] = useState<BetWithStatline[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalConfidenceScore, setGlobalConfidenceScore] = useState<number>(75);

  // Fetch real pending bets from database using helper functions
  useEffect(() => {
    const fetchPendingBets = async () => {
      try {
        // Fetch pending bets using helper
        const bets = await getCurrentUserPendingBets();

        // Fetch global confidence score using helper
        const confidence = await getCurrentUserConfidenceScore();
        const globalScore = confidence?.score ?? 75;
        setGlobalConfidenceScore(globalScore);

        // Calculate bet-specific statlines for each bet in parallel
        const betsWithData = await Promise.all(
          bets.map(async (bet) => {
            const statlineData = bet.slip_id
              ? await calculateBetStatline(bet.user_id, bet.slip_id)
              : null;

            return {
              ...bet,
              statline: statlineData?.statline || "Loading...",
              fadeConfidence: statlineData?.fadeConfidence || globalScore
            };
          })
        );

        setBetsWithStatlines(betsWithData);
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

  if (betsWithStatlines.length === 0) {
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

  // Determine which bets to show
  const betsToShow = showAll ? betsWithStatlines : betsWithStatlines.slice(0, 3);
  const hasMoreBets = betsWithStatlines.length > 3;

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

              {/* Bet-specific statline */}
              <div className="text-center">
                <p className="text-sm text-gray-400 italic">
                  {bet.statline}
                </p>
              </div>

              {/* Fade confidence */}
              <div className="text-center">
                <p className="text-base font-semibold text-gray-300">
                  Fade Confidence: <span className="text-[#AEE3F5] font-bold">{Math.round(bet.fadeConfidence)}%</span>
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
            {showAll ? `Show Top 3 Bets` : `View All ${betsWithStatlines.length} Pending Bets`}
            {!showAll && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PendingBetsList;
