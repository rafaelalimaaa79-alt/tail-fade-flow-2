
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";
import { Separator } from "./ui/separator";
import { useAllUsersPendingBets } from "@/hooks/useAllUsersPendingBets";
// removed unused getCurrentUserId import
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardCarouselProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const LeaderboardCarousel = ({ currentIndex, onIndexChange }: LeaderboardCarouselProps) => {
  const navigate = useNavigate();
  const { bets: allUsersPendingBets, loading: betsLoading } = useAllUsersPendingBets();
  const { user: currentUser } = useAuth();

  const fadeOfTheDay = useMemo(() => {
    if (!allUsersPendingBets || allUsersPendingBets.length === 0) return null;
    const othersBets = currentUser?.id
      ? allUsersPendingBets.filter(b => b.userId !== currentUser.id)
      : allUsersPendingBets;
    if (othersBets.length === 0) return null;
    // Select bet with highest fadeConfidence; on tie, keep first encountered
    return othersBets.reduce((top, current) => {
      if (!top) return current;
      const topScore = top.fadeConfidence ?? -Infinity;
      const curScore = current.fadeConfidence ?? -Infinity;
      if (curScore > topScore) return current;
      return top;
    }, null as any);
  }, [allUsersPendingBets, currentUser?.id]);

  const emptyMessage = useMemo(() => {
    if (!allUsersPendingBets || allUsersPendingBets.length === 0) {
      return "No pending bets available";
    }
    if (currentUser?.id) {
      const othersCount = allUsersPendingBets.filter(b => b.userId !== currentUser.id).length;
      if (othersCount === 0) return "No pending bets from other users";
    }
    return "No pending bets available for fade";
  }, [allUsersPendingBets, currentUser?.id]);

  const displayMarketType = useMemo(() => {
    if (!fadeOfTheDay) return "unknown";
    let marketType = fadeOfTheDay.bet?.bet_type || "unknown";
    const pos = (fadeOfTheDay.bet?.position || "").toLowerCase();
    if (marketType === "total") {
      if (pos.includes("over")) marketType = "over";
      else if (pos.includes("under")) marketType = "under";
    }
    return marketType;
  }, [fadeOfTheDay]);

  // Function to handle navigation to trends page
  const navigateToTrends = () => {
    navigate(`/trends`);
  };

  // Loading state
  if (betsLoading) {
    return (
      <div className="w-full px-2">
        <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-[#AEE3F5] font-exo uppercase tracking-wide text-center mb-3">
              Fade of the Day
            </h3>
            <Separator className="bg-[#AEE3F5]/30" />
          </div>
          <div className="text-center py-8">
            <p className="text-gray-400">Loading fade of the day...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!fadeOfTheDay) {
    return (
      <div className="w-full px-2">
        <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-[#AEE3F5] font-exo uppercase tracking-wide text-center mb-3">
              Fade of the Day
            </h3>
            <Separator className="bg-[#AEE3F5]/30" />
          </div>
          <div className="text-center py-8">
            <p className="text-gray-400">{emptyMessage}</p>
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
            Fade of the Day
          </h3>
          <Separator className="bg-[#AEE3F5]/30" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 border border-white/10">
            <div className="min-w-0">
              <p className="text-base font-semibold text-white truncate">
                {fadeOfTheDay.username}
              </p>
              <p className="text-sm text-gray-300 truncate">
                {fadeOfTheDay.bet?.event || "Unknown Event"}
              </p>
              <p className="text-xs text-gray-400 truncate">{displayMarketType}</p>
            </div>
            <div className="ml-4 flex-shrink-0 text-right">
              <div className="inline-flex items-center rounded-full bg-red-600/20 text-red-300 px-3 py-1 text-sm font-bold">
                {Math.round(fadeOfTheDay.fadeConfidence ?? 0)}%
              </div>
            </div>
          </div>
        </div>

        <ActionButton
          variant="fade"
          className="mt-4 h-10 text-sm"
          onClick={navigateToTrends}
        >
          See More Trends
        </ActionButton>
      </div>
    </div>
  );
};

export default LeaderboardCarousel;
