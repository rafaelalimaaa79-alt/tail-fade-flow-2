import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendsTitle from "@/components/trends/TrendsTitle";
import TrendsList, { TrendData } from "@/components/trends/TrendsList";
import TrendsNotificationHandler from "@/components/trends/TrendsNotificationHandler";
import BadgeAnimationHandler from "@/components/dashboard/BadgeAnimationHandler";
import TopTenReveal from "@/components/trends/TopTenReveal";
import SettingsIcon from "@/components/common/SettingsIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { useNavigate } from "react-router-dom";
import FloatingSyncButton from "@/components/common/FloatingSyncButton";
import { BettorStats } from "@/utils/bettorStatsCalculator";
import { useAllUsersPendingBets } from "@/hooks/useAllUsersPendingBets";
import { BetRecord } from "@/services/userDataService";

// Extended TrendData to include the full bet record
export interface EnhancedTrendData extends TrendData {
  bet: BetRecord;
  stats?: BettorStats;
  sportStatline?: string;
}

const Trends = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showTopTen, setShowTopTen] = useState(false);
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();

  // Use hook to fetch all users' pending bets
  const { bets: allUsersPendingBets, loading: betsLoading } = useAllUsersPendingBets();

  // Convert pending bets to EnhancedTrendData format
  const [convertedTrends, setConvertedTrends] = useState<EnhancedTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  // Convert all users' pending bets to EnhancedTrendData format
  useEffect(() => {
    const convertBets = async () => {
      try {
        setLoading(true);

        if (allUsersPendingBets.length === 0) {
          setConvertedTrends([]);
          setLoading(false);
          return;
        }

        // Convert all users' pending bets to EnhancedTrendData format
        const converted: EnhancedTrendData[] = allUsersPendingBets.map((pendingBet) => {
          // Determine market type (handle over/under separation)
          let marketType = pendingBet.bet.bet_type || "unknown";
          if (marketType === 'total' && pendingBet.bet.position) {
            const pos = pendingBet.bet.position.toLowerCase();
            if (pos.includes('over')) {
              marketType = 'over';
            } else if (pos.includes('under')) {
              marketType = 'under';
            }
          }

          return {
            id: pendingBet.id,
            name: pendingBet.username, // Use actual username instead of "You"
            betDescription: pendingBet.bet.event || "Unknown Event",
            betType: pendingBet.bet.bet_type || "straight",
            isTailRecommendation: false,
            reason: `${pendingBet.bet.sportsbook_name || "Sportsbook"} - ${pendingBet.bet.bet_type || "Bet"}`,
            recentBets: [],
            unitPerformance: pendingBet.userUnitsGained ?? 0,
            tailScore: pendingBet.fadeConfidence,
            fadeScore: pendingBet.fadeConfidence,
            userCount: pendingBet.userTotalBets ?? 0,
            categoryBets: [],
            categoryName: marketType,
            bet: pendingBet.bet,
            stats: {
              wins: Math.round((pendingBet.userWinRate ?? 0) / 100 * (pendingBet.userTotalBets ?? 0)),
              losses: Math.round((100 - (pendingBet.userWinRate ?? 0)) / 100 * (pendingBet.userTotalBets ?? 0)),
              pushes: 0,
              totalBets: pendingBet.userTotalBets ?? 0,
              winRate: pendingBet.userWinRate ?? 0,
              fadeConfidence: Math.round(pendingBet.fadeConfidence),
              netProfit: pendingBet.userUnitsGained ?? 0,
              avgOdds: 0,
              recentForm: []
            },
            sportStatline: pendingBet.statline,
          };
        });

        setConvertedTrends(converted);
      } catch (err: any) {
        console.error("Error converting bets:", err);
      } finally {
        setLoading(false);
      }
    };

    convertBets();
  }, [allUsersPendingBets]);



  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
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
            <SettingsIcon />
          </div>
        </div>

        <TrendsTitle />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-[#AEE3F5] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading pending bets...</p>
          </div>
        ) : showTopTen ? (
          <TopTenReveal isRevealed={showTopTen} />
        ) : convertedTrends.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#AEE3F5] mb-4">
              No Pending Bets
            </h2>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Sync your sportsbook account to see auto-fade recommendations based on your betting history!
            </p>
            <p className="text-sm text-gray-500">
              Click the sync button below to get started
            </p>
          </div>
        ) : (
          <TrendsList trendData={convertedTrends} />
        )}

        {isOpen && (
          <InlineSmackTalk
            isOpen={isOpen}
            onClose={closeSmackTalk}
            itemId={smackTalkData?.itemId || ""}
            itemTitle={smackTalkData?.itemTitle}
          />
        )}
      </div>

      <TrendsNotificationHandler />
      <BadgeAnimationHandler />
      <FloatingSyncButton />
      <BottomNav />
    </div>
  );
};

export default Trends;
