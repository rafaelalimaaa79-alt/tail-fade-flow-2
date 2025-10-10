import React, { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendsHeader from "@/components/trends/TrendsHeader";
import TrendsTitle from "@/components/trends/TrendsTitle";
import TrendsList, { TrendData } from "@/components/trends/TrendsList";
import BetSlipsList from "@/components/betslips/BetSlipsList";
import TrendsNotificationHandler from "@/components/trends/TrendsNotificationHandler";
import BadgeAnimationHandler from "@/components/dashboard/BadgeAnimationHandler";
import TopTenReveal from "@/components/trends/TopTenReveal";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { trendData } from "@/data/trendData";
import { useNavigate } from "react-router-dom";
import FloatingSyncButton from "@/components/common/FloatingSyncButton";
import { BetSlip } from "@/types/betslips";
import { supabase } from "@/integrations/supabase/client";
import { DbBetRecord } from "@/utils/betLineParser";
import { calculateStatsFromArray, BettorStats } from "@/utils/bettorStatsCalculator";

// Extended TrendData to include the full bet record
export interface EnhancedTrendData extends TrendData {
  bet: DbBetRecord;
  stats?: BettorStats;
}

const Trends = () => {
  const [betSlips, setBetSlips] = useState<BetSlip[]>([]);
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

  useEffect(() => {
    const fetchBetsFromDatabase = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user.id;
        const username = data.session?.user.email?.split("@")[0];

        if (!userId) {
          setLoading(false);
          return;
        }

        // Read bets from Supabase database
        const { data: bets, error } = await supabase
          .from("bets")
          .select("*")
          .eq("user_id", userId)
          .eq("result", "Pending")
          // .gte('event_start_time', new Date().toISOString())
          .order("event_start_time", { ascending: true });

        if (error) {
          console.error("Error fetching bets:", error);
          setLoading(false);
          return;
        }

        console.log("Bets from database:", bets);

        // Fetch historical bets for statistics (using only existing columns)
        const { data: historicalBets } = await supabase
          .from("bets")
          .select("result, units_won_lost, odds, bet_type")
          .eq("user_id", userId)
          .in("result", ["Win", "Loss", "Push"])
          .order("created_at", { ascending: false })
          .limit(50);

        // Calculate statistics from historical data
        const stats = historicalBets && historicalBets.length > 0 
          ? calculateStatsFromArray(historicalBets)
          : {
              wins: 0,
              losses: 0,
              pushes: 0,
              totalBets: 0,
              winRate: 0,
              fadeConfidence: 50,
              netProfit: 0,
              avgOdds: 0,
              recentForm: []
            };

        // Convert bets to EnhancedTrendData
        const converted: EnhancedTrendData[] = (bets || []).map((bet: any) => {
          return {
            id: bet.id,
            name: username || "You",
            betDescription: bet.event || "Unknown Event",
            betType: bet.bet_type || "straight",
            isTailRecommendation: false, // We're showing fade opportunities
            reason: `${bet.sportsbook_name || "Sportsbook"} - ${bet.bet_type || "Bet"}`,
            recentBets: stats.recentForm.length > 0 ? stats.recentForm : [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            unitPerformance: stats.netProfit,
            tailScore: stats.fadeConfidence,
            fadeScore: stats.fadeConfidence,
            userCount: stats.totalBets,
            categoryBets: stats.recentForm.slice(0, 5),
            categoryName: bet.bet_type || "straight",
            // Add the full bet record for bet line calculations
            bet: bet as DbBetRecord,
            stats: stats,
          };
        });

        setConvertedTrends(converted);
      } catch (err: any) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBetsFromDatabase();

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

        {showTopTen ? <TopTenReveal isRevealed={showTopTen} /> : <TrendsList trendData={convertedTrends} />}
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
