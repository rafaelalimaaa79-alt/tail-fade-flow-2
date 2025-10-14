import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendsTitle from "@/components/trends/TrendsTitle";
import TrendsList, { TrendData } from "@/components/trends/TrendsList";
import TrendsNotificationHandler from "@/components/trends/TrendsNotificationHandler";
import BadgeAnimationHandler from "@/components/dashboard/BadgeAnimationHandler";
import TopTenReveal from "@/components/trends/TopTenReveal";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { useNavigate } from "react-router-dom";
import FloatingSyncButton from "@/components/common/FloatingSyncButton";
import { supabase } from "@/integrations/supabase/client";
import { BettorStats } from "@/utils/bettorStatsCalculator";
import {
  getCurrentUserPendingBets,
  getCurrentUserConfidenceScore,
  getCurrentUserProfile,
  calculateBetStatline,
  BetRecord
} from "@/services/userDataService";

// Extended TrendData to include the full bet record
export interface EnhancedTrendData extends TrendData {
  bet: BetRecord;
  stats?: BettorStats;
  sportStatline?: string;
}

const Trends = () => {
  const [convertedTrends, setConvertedTrends] = useState<EnhancedTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  const SharpSportKey = "969e890a2542ae09830c54c7c5c0eadb29138c00";
  // const internalId = "b3ee8956-c455-4ae8-8410-39df182326dc";

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showTopTen, setShowTopTen] = useState(false);
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  // Extract fetchBetsFromDatabase so it can be called from event listener
  const fetchBetsFromDatabase = async () => {
    try {
      console.log("Fetching bets from database...");

      // Fetch pending bets using helper
      const bets = await getCurrentUserPendingBets();

      // Fetch confidence score using helper
      const confidenceData = await getCurrentUserConfidenceScore();

      console.log("Confidence data from backend:", confidenceData);

      // Fetch user profile using helper
      const profileData = await getCurrentUserProfile();

      console.log("Profile data from backend:", profileData);
      console.log("Pending bets from database:", bets);

      // If no pending bets, show empty state
      if (!bets || bets.length === 0) {
        console.log("No pending bets found");
        setConvertedTrends([]);
        setLoading(false);
        return;
      }

      // Convert pending bets to EnhancedTrendData
      // Use backend confidence score (global fade confidence)
      const globalFadeConfidence = confidenceData?.score ?? 50;

      // Calculate bet-specific statlines for each bet in parallel
      const converted: EnhancedTrendData[] = await Promise.all(
        (bets || []).map(async (bet) => {
          // Determine market type (handle over/under separation)
          let marketType = bet.bet_type || "unknown";
          if (marketType === 'total' && bet.position) {
            const pos = bet.position.toLowerCase();
            if (pos.includes('over')) {
              marketType = 'over';
            } else if (pos.includes('under')) {
              marketType = 'under';
            }
          }

          // Get bet-specific statline and fade confidence
          const statlineData = bet.slip_id
            ? await calculateBetStatline(bet.user_id, bet.slip_id)
            : null;

          const betSpecificStatline = statlineData?.statline || "Loading...";
          const betSpecificFadeConfidence = statlineData?.fadeConfidence || globalFadeConfidence;

          return {
            id: bet.id || "",
            name: "You",
            betDescription: bet.event || "Unknown Event",
            betType: bet.bet_type || "straight",
            isTailRecommendation: false,
            reason: `${bet.sportsbook_name || "Sportsbook"} - ${bet.bet_type || "Bet"}`,
            recentBets: [],
            unitPerformance: profileData?.units_gained ?? 0,
            tailScore: betSpecificFadeConfidence,
            fadeScore: betSpecificFadeConfidence,
            userCount: profileData?.total_bets ?? 0,
            categoryBets: [],
            categoryName: marketType,
            bet: bet,
            stats: {
              wins: Math.round((profileData?.win_rate ?? 0) / 100 * (profileData?.total_bets ?? 0)),
              losses: Math.round((100 - (profileData?.win_rate ?? 0)) / 100 * (profileData?.total_bets ?? 0)),
              pushes: 0,
              totalBets: profileData?.total_bets ?? 0,
              winRate: profileData?.win_rate ?? 0,
              fadeConfidence: Math.round(betSpecificFadeConfidence),
              netProfit: profileData?.units_gained ?? 0,
              avgOdds: 0,
              recentForm: []
            },
            sportStatline: betSpecificStatline,
          };
        })
      );

      setConvertedTrends(converted);
    } catch (err: any) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBetsFromDatabase();

    // Listen for sync completion events
    const handleBetsSynced = (event: Event) => {
      console.log('Bets synced event received, refetching data...');
      fetchBetsFromDatabase();
    };

    window.addEventListener('bets-synced', handleBetsSynced);

    // Set up realtime subscription for live bet updates
    supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) return;

      const channel = supabase
        .channel("bets-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bets",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("Bet change detected:", payload);
            fetchBetsFromDatabase();
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });

    return () => {
      window.removeEventListener('bets-synced', handleBetsSynced);
    };
  }, []);

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
            <ProfileIcon />
          </div>
        </div>

        <TrendsTitle />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-[#AEE3F5] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading your bets...</p>
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
