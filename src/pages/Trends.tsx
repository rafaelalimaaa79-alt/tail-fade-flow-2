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
          .from('bets')
          .select('*')
          .eq('user_id', userId)
          .eq('result', 'Pending')
          .gte('event_start_time', new Date().toISOString())
          .order('event_start_time', { ascending: true });

        if (error) {
          console.error("Error fetching bets:", error);
          setLoading(false);
          return;
        }

        console.log("Bets from database:", bets);

        // Convert bets to TrendData
        const converted: TrendData[] = (bets || []).map((bet: any, index: number) => {
          // Parse event to get teams
          let awayTeam = 'Away';
          let homeTeam = 'Home';
          
          if (bet.event) {
            if (bet.event.includes(' vs ')) {
              const parts = bet.event.split(' vs ');
              awayTeam = parts[0]?.trim() || awayTeam;
              homeTeam = parts[1]?.trim() || homeTeam;
            } else if (bet.event.includes(' @ ')) {
              const parts = bet.event.split(' @ ');
              awayTeam = parts[0]?.trim() || awayTeam;
              homeTeam = parts[1]?.trim() || homeTeam;
            } else {
              awayTeam = bet.event;
            }
          }

          return {
            id: bet.id,
            name: username || 'You',
            betDescription: `${awayTeam} vs ${homeTeam}`,
            betType: bet.bet_type || 'straight',
            isTailRecommendation: true,
            reason: `${bet.sportsbook_name || 'Sportsbook'} - ${bet.bet_type || 'Bet'}`,
            recentBets: [1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
            unitPerformance: bet.units_risked || 0,
            tailScore: Math.abs(parseFloat(bet.odds || '100')),
            fadeScore: Math.abs(parseFloat(bet.odds || '100')) / 2,
            userCount: parseFloat(bet.odds || '0'),
            categoryBets: [1, 1, 0, 1, 0],
            categoryName: bet.bet_type || 'straight',
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
        .channel('bets-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bets',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('Bet change detected:', payload);
            fetchBetsFromDatabase();
          }
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
