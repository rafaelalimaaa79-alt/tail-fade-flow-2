
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { getColdestBettorsWithPendingBets, getCurrentUserId } from "@/services/userDataService";
import { calculateBetLine } from "@/utils/betLineParser";

interface LeaderboardCarouselProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

interface ColdBettor {
  id: string;
  name: string;
  profit: number;
  confidenceScore: number;
  statline: string | null;
  pendingBets: any[];
  streak: number[];
}

const LeaderboardCarousel = ({ currentIndex, onIndexChange }: LeaderboardCarouselProps) => {
  const navigate = useNavigate();
  const [coldestBettors, setColdestBettors] = useState<ColdBettor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch coldest bettors with pending bets
  useEffect(() => {
    const fetchColdestBettors = async () => {
      try {
        const currentUserId = await getCurrentUserId();
        const bettors = await getColdestBettorsWithPendingBets(5, currentUserId || undefined);
        setColdestBettors(bettors);
      } catch (error) {
        console.error('Error fetching coldest bettors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColdestBettors();
  }, []);

  // Function to handle navigation to leaders page
  const navigateToLeaders = (type: 'fade') => {
    navigate(`/leaders?type=${type}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full px-2">
        <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-[#AEE3F5] font-exo uppercase tracking-wide text-center mb-3">
              Can't Buy a Win
            </h3>
            <Separator className="bg-[#AEE3F5]/30" />
          </div>
          <div className="text-center py-8">
            <p className="text-gray-400">Loading coldest bettors...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (coldestBettors.length === 0) {
    return (
      <div className="w-full px-2">
        <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-[#AEE3F5] font-exo uppercase tracking-wide text-center mb-3">
              Can't Buy a Win
            </h3>
            <Separator className="bg-[#AEE3F5]/30" />
          </div>
          <div className="text-center py-8">
            <p className="text-gray-400">No cold bettors with pending bets</p>
            <p className="text-sm text-gray-500 mt-2">Check back later!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2">
      <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-[#AEE3F5] font-exo uppercase tracking-wide text-center mb-3">
            Can't Buy a Win
          </h3>
          <Separator className="bg-[#AEE3F5]/30" />
        </div>

        <div className="space-y-4">
          {coldestBettors.map((bettor, bettorIndex) => (
            <div key={bettor.id}>
              {/* Bettor Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-sm">@{bettor.name}</span>
                {bettor.confidenceScore > 0 && (
                  <Badge className="bg-onetime-red text-white text-xs">
                    {Math.round(bettor.confidenceScore)}% Fade
                  </Badge>
                )}
              </div>

              {/* Statline */}
              {bettor.statline && (
                <p className="text-xs text-gray-400 italic mb-2">{bettor.statline}</p>
              )}

              {/* Show ALL pending bets for this bettor */}
              {bettor.pendingBets.length > 0 ? (
                <div className="space-y-1">
                  {bettor.pendingBets.map((bet) => {
                    const betLine = calculateBetLine(bet);
                    return (
                      <BettorStreakItem
                        key={bet.id}
                        id={bet.id}
                        name={betLine}
                        profit={bettor.profit}
                        streak={bettor.streak}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-2">No pending bets</p>
              )}

              {/* Separator between bettors (not after last one) */}
              {bettorIndex < coldestBettors.length - 1 && (
                <Separator className="my-4 bg-[#AEE3F5]/30" />
              )}
            </div>
          ))}
        </div>

        <ActionButton
          variant="fade"
          className="mt-4 h-10 text-sm"
          onClick={() => navigateToLeaders('fade')}
        >
          View All Cold Bettors
        </ActionButton>
      </div>
    </div>
  );
};

export default LeaderboardCarousel;
