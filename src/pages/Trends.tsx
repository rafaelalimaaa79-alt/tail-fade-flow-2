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

const Trends = () => {
  const [betSlips, setBetSlips] = useState<BetSlip[]>([]);
  const [convertedTrends, setConvertedTrends] = useState<TrendData[]>([]);
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
    const fetchBetSlips = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user.id;
        const username = data.session?.user.email?.split("@")[0];

        console.log("username: ", username);

        if (!userId) {
          console.log("No user session found");
          setLoading(false);
          return;
        }

        // Fetch bets from Supabase
        const { data: betsData, error } = await supabase
          .from("bets")
          .select("*")
          .eq("user_id", userId)
          .eq("result", "Pending")
          .gte("timestamp", new Date().toISOString())
          .order("timestamp", { ascending: true });

        if (error) {
          console.error("Error fetching bets:", error);
          throw error;
        }

        console.log("Bets from Supabase:", betsData);

        // Convert Supabase bets to TrendData
        const converted: TrendData[] = (betsData || []).map((bet) => ({
          id: bet.id,
          name: username,
          betDescription: bet.event,
          betType: bet.bet_type,
          isTailRecommendation: true,
          reason: `Bet placed on ${new Date(bet.created_at).toLocaleDateString()}`,
          recentBets: [1, 1, 0, 1, 0, 1, 1, 0, 1, 1], // Mock data
          unitPerformance: 0,
          tailScore: 75,
          fadeScore: 25,
          userCount: parseInt(bet.odds) || 0,
          categoryBets: [1, 1, 0, 1, 0],
          categoryName: bet.bet_type,
        }));

        setConvertedTrends(converted);
      } catch (err: any) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBetSlips();
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

        {showTopTen ? <TopTenReveal isRevealed={showTopTen} /> : <TrendsList trendData={trendData} />}
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
