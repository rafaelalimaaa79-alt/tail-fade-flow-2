import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import LeaderboardTable from "@/components/leaders/LeaderboardTable";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { useNavigate } from "react-router-dom";
import FloatingSyncButton from "@/components/common/FloatingSyncButton";
import { getLeaderboardData, getCurrentUserId } from "@/services/userDataService";

interface LeaderboardUser {
  id: string;
  username: string;
  totalBets: number;
  winRate: number;
  roi: number;
  unitsGained: number;
  confidenceScore: number | null;
  statline: string | null;
  isCurrentUser: boolean;
}

const Leaders = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();
  const [coldestBettors, setColdestBettors] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const currentUserId = await getCurrentUserId();
        const data = await getLeaderboardData(currentUserId || undefined);

        // Get coldest bettors (negative units)
        const cold = data.filter(user => user.unitsGained < 0)
          .sort((a, b) => a.unitsGained - b.unitsGained)
          .slice(0, 10);

        setColdestBettors(cold);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-4">
          <img
            src="/lovable-uploads/7b63dfa5-820d-4bd0-82f2-9e01001a0364.png"
            alt="NoShot logo"
            className="h-40 cursor-pointer"
            onClick={handleLogoClick}
          />
          <div className="flex items-center gap-2">
            <HeaderChatIcon />
            <ProfileIcon />
          </div>
        </div>

        <div className="mb-6 text-center bg-gradient-to-r from-[#AEE3F5]/10 to-[#AEE3F5]/5 rounded-xl border border-[#AEE3F5]/20 p-6">
          <h2 className="text-3xl font-bold font-exo text-[#AEE3F5] uppercase tracking-wide mb-2 drop-shadow-[0_0_8px_rgba(174,227,245,0.7)]">
            Fade Leaderboard
          </h2>
          <p className="text-base text-white/70 font-medium">
            Top 10 Worst Bettors
          </p>
        </div>

        <div className="space-y-2 animate-fade-in">
          <LeaderboardTable
            bettors={coldestBettors}
            showAll={false}
            setShowAll={() => {}}
            variant="fade"
            loading={loading}
          />
        </div>
        
        {isOpen && (
          <InlineSmackTalk
            isOpen={isOpen}
            onClose={closeSmackTalk}
            itemId={smackTalkData?.itemId || ""}
            itemTitle={smackTalkData?.itemTitle}
          />
        )}
      </div>
      <FloatingSyncButton />
      <BottomNav />
    </div>
  );
};

export default Leaders;
