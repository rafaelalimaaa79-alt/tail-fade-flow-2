
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
        const internalId = data.session?.user.id;
        console.log("internalId: ", internalId);
        
        const response = await fetch(
          `https://api.sharpsports.io/v1/bettors/${internalId}/betSlips?status=pending&limit=50`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Token ${SharpSportKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const betSlipData: BetSlip[] = await response.json();
        console.log("BetSlips Response:", betSlipData);
        
        // Filter for pending bet slips with all pending bets
        const filteredData = (betSlipData || []).filter(slip => 
          slip.status === "pending" && 
          slip.bets.every(bet => bet.status === "pending")
        );
        
        setBetSlips(filteredData);
        
        // Convert betSlips to TrendData
        const converted: TrendData[] = filteredData.map((slip, index) => ({
          id: slip.id,
          name: slip.bets[0]?.event?.name || `${slip.bets[0]?.event?.contestantAway?.fullName} vs ${slip.bets[0]?.event?.contestantHome?.fullName}` || `Bet ${index + 1}`,
          betDescription: slip.bets[0]?.bookDescription || `${slip.bets[0]?.type} ${slip.bets[0]?.line ? `(${slip.bets[0].line})` : ''} @ ${slip.bets[0]?.oddsAmerican}`,
          betType: slip.bets[0]?.type || slip.type,
          isTailRecommendation: Math.random() > 0.5, // Random for now
          reason: `${slip.book.name} bet placed on ${new Date(slip.timePlaced).toLocaleDateString()}`,
          recentBets: [1, 1, 0, 1, 0, 1, 1, 0, 1, 1], // Mock data
          unitPerformance: slip.toWin - slip.atRisk,
          tailScore: Math.floor(Math.random() * 30) + 70,
          fadeScore: Math.floor(Math.random() * 30) + 70,
          userCount: Math.floor(Math.random() * 50) + 10,
          categoryBets: [1, 1, 0, 1, 0],
          categoryName: slip.bets[0]?.event?.sport || 'General'
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
        
        {showTopTen ? (
          <TopTenReveal isRevealed={showTopTen} />
        ) : (
          <TrendsList trendData={[...trendData, ...convertedTrends]} />
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
