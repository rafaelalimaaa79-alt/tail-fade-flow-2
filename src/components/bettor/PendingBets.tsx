
import React, { useState, useEffect } from "react";
import { BettorBet, BettorProfile } from "@/types/bettor";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { showFadeNotification } from "@/utils/betting-notifications";
import ActionButton from "@/components/ActionButton";
import { ThumbsUp, ThumbsDown, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getConfidenceScore, calculateBetStatline } from "@/services/userDataService";

type PendingBetsProps = {
  pendingBets: BettorBet[];
  profile: BettorProfile;
  className?: string;
};

interface BetWithStatline extends BettorBet {
  fadeConfidence: number;
  sportStatline: string;
  matchup: { game: string; teams: string[]; sport: string };
  betLine: string;
}

const PendingBets: React.FC<PendingBetsProps> = ({ pendingBets, profile, className }) => {
  const [showAll, setShowAll] = useState(false);
  const [globalConfidenceScore, setGlobalConfidenceScore] = useState<number>(0);
  const [betsWithStatlines, setBetsWithStatlines] = useState<BetWithStatline[]>([]);
  const [animatingBetId, setAnimatingBetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch global confidence score (for overall fade confidence)
  useEffect(() => {
    const fetchConfidenceScore = async () => {
      if (!profile.userId) return;

      const data = await getConfidenceScore(profile.userId);
      if (data) {
        setGlobalConfidenceScore(data.score);
      }
    };

    fetchConfidenceScore();
  }, [profile.userId]);

  // Fetch bet-specific statlines for each pending bet
  useEffect(() => {
    const fetchBetStatlines = async () => {
      if (!profile.userId || pendingBets.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // Calculate statline for each bet in parallel
      const betsWithData = await Promise.all(
        pendingBets.map(async (bet) => {
          // Get bet-specific statline
          const statlineData = bet.id
            ? await calculateBetStatline(profile.userId, bet.id)
            : null;

          return {
            ...bet,
            fadeConfidence: statlineData?.fadeConfidence || globalConfidenceScore || 0,
            sportStatline: statlineData?.statline || "Loading...",
            matchup: { game: bet.teams, teams: [bet.teams], sport: "NCAAFB" },
            betLine: bet.betType
          };
        })
      );

      // Sort by fade confidence (highest first)
      const sorted = betsWithData.sort((a, b) => b.fadeConfidence - a.fadeConfidence);
      setBetsWithStatlines(sorted);
      setLoading(false);
    };

    fetchBetStatlines();
  }, [pendingBets, profile.userId, globalConfidenceScore]);

  const handleFade = (bet: BettorBet) => {
    setAnimatingBetId(bet.id || null);
    showFadeNotification("Bettor", bet.betType);
    setTimeout(() => setAnimatingBetId(null), 300);
  };

  // Determine which bets to show
  const betsToShow = showAll ? betsWithStatlines : betsWithStatlines.slice(0, 3);
  const hasMoreBets = pendingBets.length > 3;

  return (
    <div className={cn("rounded-xl bg-black p-6 shadow-2xl relative overflow-hidden border border-white/10", className)}>
      <h3 className="mb-6 text-3xl font-bold text-[#AEE3F5] text-center relative z-10 drop-shadow-[0_0_8px_rgba(174,227,245,0.7)] font-rajdhani uppercase tracking-wide">
        Pending Bets
      </h3>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading bet statlines...</p>
        </div>
      ) : pendingBets.length > 0 ? (
        <div className="space-y-6 relative z-10">
          {betsToShow.map((bet, index) => {
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
                    <h3 className="text-2xl font-bold text-white relative inline-block">
                      {bet.matchup.game}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
                    </h3>
                  </div>
                  
                  {/* Bettor's pick */}
                  <div className="text-center py-1">
                    <p className="text-lg font-bold">
                      <span className="text-[#AEE3F5]">@{profile.username}</span>
                      <span className="text-white"> is on {bet.betLine}</span>
                    </p>
                  </div>
                  
                  {/* Sport-specific statline */}
                  <div className="text-center py-1">
                    <p className="text-base font-medium text-gray-400 italic">
                      {bet.sportStatline?.replace(/\bthe\s+(?=[A-Z][a-zA-Z]+)/g, '') || bet.sportStatline}
                    </p>
                  </div>
                  
                  {/* Divider line */}
                  <div className="flex justify-center py-1">
                    <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
                  </div>
                  
                  {/* Fade confidence */}
                  <div className="text-center py-1">
                    <p className="text-lg font-semibold text-gray-300">
                      Fade Confidence: <span className="text-[#AEE3F5] font-bold">{bet.fadeConfidence.toFixed(2)}%</span>
                    </p>
                  </div>
                  
                  {/* Fade button */}
                  <div className="w-full pt-1">
                    <Button
                      className={`w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold py-3 rounded-xl ${animatingBetId === bet.id && "animate-bounce-pop"}`}
                      onClick={() => handleFade(bet)}
                    >
                      NoShot Pick: {bet.betLine}
                    </Button>
                  </div>
                </div>
                
                {/* Separator line between cards (not after the last one) */}
                {index < betsToShow.length - 1 && (
                  <div className="flex justify-center py-4">
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
      ) : (
        <div className="rounded-lg bg-black p-6 text-center border border-white/10">
          <p className="text-gray-400">@{profile.username} has no active bets right now</p>
        </div>
      )}
    </div>
  );
};

export default PendingBets;
