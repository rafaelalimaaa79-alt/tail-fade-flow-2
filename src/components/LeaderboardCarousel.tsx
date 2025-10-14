
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";
import { Separator } from "./ui/separator";
import { getColdestBettorsWithPendingBets, getCurrentUserId } from "@/services/userDataService";

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

        <div className="space-y-1">
          {coldestBettors.map((bettor) => (
            <BettorStreakItem
              key={bettor.id}
              id={bettor.id}
              name={bettor.name}
              profit={bettor.profit}
              streak={bettor.streak}
            />
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
