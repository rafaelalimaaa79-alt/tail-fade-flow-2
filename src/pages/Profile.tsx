import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import UserHeader from "@/components/profile/UserHeader";
import PendingBetsSection from "@/components/profile/PendingBetsSection";
import PerformanceSection from "@/components/profile/PerformanceSection";
import BiggestWinsSection from "@/components/profile/BiggestWinsSection";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { useAuth } from "@/contexts/AuthContext";
import { calculateBettorStats } from "@/utils/bettorStatsCalculator";
import { BetHistoryPoint } from "@/types/bettor";

const ProfilePage = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const navigate = useNavigate();
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();
  const { user } = useAuth();
  
  // State for real user stats
  const [userStats, setUserStats] = useState({
    username: user?.email?.split('@')[0] || "User",
    rank: 0,
    rankChange: 0,
    winRate: 0,
    roi: 0,
    profit: 0,
    totalBets: 0,
    chartData: [] as BetHistoryPoint[],
    performanceByTimeframe: {
      '1D': 0,
      '1W': 0,
      '1M': 0,
      '3M': 0,
      '1Y': 0
    }
  });

  // Fetch real user statistics
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserStats = async () => {
      try {
        // Fetch stats for the selected timeframe
        const stats = await calculateBettorStats(user.id, undefined, undefined, 50);

        setUserStats(prev => ({
          ...prev,
          winRate: stats.winRate,
          roi: stats.winRate > 0 ? ((stats.netProfit / stats.totalBets) * 100) : 0,
          profit: stats.netProfit,
          totalBets: stats.totalBets,
          chartData: [],
        }));
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, [user?.id, timeframe]);


  return (
    <div className="bg-black min-h-screen pb-20">
      <div className="max-w-md mx-auto w-full px-2">
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/7b63dfa5-820d-4bd0-82f2-9e01001a0364.png" 
            alt="NoShot logo" 
            className="h-40 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
          <div className="flex items-center gap-2">
            <HeaderChatIcon />
            <ProfileIcon />
          </div>
        </div>

        <UserHeader 
          username={userStats.username} 
          rank={userStats.rank} 
          rankChange={userStats.rankChange} 
        />

        <PendingBetsSection />
        
        {isOpen && (
          <InlineSmackTalk
            isOpen={isOpen}
            onClose={closeSmackTalk}
            itemId={smackTalkData?.itemId || ""}
            itemTitle={smackTalkData?.itemTitle}
          />
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
