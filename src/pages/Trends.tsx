
import React, { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendsHeader from "@/components/trends/TrendsHeader";
import TrendsTitle from "@/components/trends/TrendsTitle";
import TrendsList from "@/components/trends/TrendsList";
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

        const data: BetSlip[] = await response.json();
        console.log("BetSlips Response:", data);
        
        // Filter for pending bet slips with all pending bets
        const filteredData = (data || []).filter(slip => 
          slip.status === "pending" && 
          slip.bets.every(bet => bet.status === "pending")
        );
        
        setBetSlips(filteredData);
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
 // <TrendsList trendData={trendData} />
      <BetSlipsList betSlips={betSlips} />
      // <div style={{ padding: "1rem" }}>
      //   <h2>Bet Slips</h2>
      //   {betSlips.map((slip) => (
      //     <div
      //       key={slip.id}
      //       style={{
      //         border: "1px solid #ccc",
      //         borderRadius: "8px",
      //         padding: "1rem",
      //         marginBottom: "1rem",
      //         backgroundColor: "#fafafa",
      //       }}
      //     >
      //       <h3>{slip.book.name} ({slip.type})</h3>
      //       <p><strong>Slip ID:</strong> {slip.id}</p>
      //       <p><strong>At Risk:</strong> ${slip.atRisk}</p>
      //       <p><strong>To Win:</strong> ${slip.toWin}</p>
      //       <p><strong>Status:</strong> {slip.status}</p>
      //       <p><strong>Placed:</strong> {new Date(slip.timePlaced).toLocaleString()}</p>
  
      //       <h4>Bets</h4>
      //       <ul>
      //         {slip.bets.map((bet) => (
      //           <li key={bet.id}>
      //             <strong>{bet.bookDescription}</strong> <br />
      //             Event: {bet.event.name} <br />
      //             Odds: {bet.oddsAmerican} <br />
      //             Status: {bet.status}
      //           </li>
      //         ))}
      //       </ul>
      //     </div>
      //   ))}
      //   </div>      
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
