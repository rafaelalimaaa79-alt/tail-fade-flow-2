import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TabsContainer from "@/components/leaders/TabsContainer";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();
  const [coldestBettors, setColdestBettors] = useState<LeaderboardUser[]>([]);
  const [hottestBettors, setHottestBettors] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Get active tab from URL params, default to 'cold'
  const activeTab = (searchParams.get('type') as 'hot' | 'cold') || 'cold';

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const currentUserId = await getCurrentUserId();
        const data = await getLeaderboardData(currentUserId || undefined);

        // Split data into hottest (positive units) and coldest (negative units)
        const hot = data.filter(user => user.unitsGained > 0)
          .sort((a, b) => b.unitsGained - a.unitsGained)
          .slice(0, 10);

        const cold = data.filter(user => user.unitsGained < 0)
          .sort((a, b) => a.unitsGained - b.unitsGained)
          .slice(0, 10);

        setHottestBettors(hot);
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

  const handleTabChange = (value: string) => {
    setSearchParams({ type: value });
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

        <TabsContainer
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showAll={false}
          setShowAll={() => {}}
          hottestBettors={hottestBettors}
          coldestBettors={coldestBettors}
          loading={loading}
        />
        
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
