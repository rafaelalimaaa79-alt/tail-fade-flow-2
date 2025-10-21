import React, { useRef, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import BetOfTheDay from "@/components/BetOfTheDay";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NotificationHandler from "@/components/dashboard/NotificationHandler";
import BadgeAnimationHandler from "@/components/dashboard/BadgeAnimationHandler";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { useCarouselRotation } from "@/hooks/useCarouselRotation";
import { usePortfolioStore } from "@/utils/portfolio-state";
import { useNavigate } from "react-router-dom";
import FloatingSyncButton from "@/components/common/FloatingSyncButton";
import { useSyncBets } from "@/hooks/useSyncBets";
import { SharpSportsModal } from "@/components/SharpSportsModal";
import { useAllUsersPendingBets } from "@/hooks/useAllUsersPendingBets";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const portfolioButtonRef = useRef<HTMLButtonElement>(null);
  const { resetViewedState } = usePortfolioStore();
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();
  const { syncBets, sharpSportsModal, handleModalComplete, handleModalClose } = useSyncBets();

  // Fetch all users' pending bets for Fade Watch (sorted by confidence score)
  const { bets: allUsersPendingBets, loading: betsLoading } = useAllUsersPendingBets();

  // Set up carousel rotations with custom hook
  const {
    currentIndex: topCarouselIndex,
    handleCarouselChange: handleTopCarouselChange
  } = useCarouselRotation({
    itemsCount: allUsersPendingBets.length || 1,
    rotationInterval: 5000, // Updated to 5 seconds (5000ms)
    pauseDuration: 5000 // Keep pause duration at 5 seconds (5000ms)
  });
  
  const { 
    currentIndex: bottomCarouselIndex, 
    handleCarouselChange: handleBottomCarouselChange 
  } = useCarouselRotation({
    itemsCount: 2, // Bottom carousel has 2 items
    rotationInterval: 5000, // Updated to 5 seconds (5000ms)
    pauseDuration: 5000 // Keep pause duration at 5 seconds (5000ms)
  });
  
  // Calculate target rect for the animation
  const getPortfolioRect = () => {
    if (portfolioButtonRef.current) {
      return portfolioButtonRef.current.getBoundingClientRect();
    }
    return null;
  };
  
  // For testing purposes - simulate a bet after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      resetViewedState(); // Reset the viewed state to make the briefcase glow
    }, 1500);

    return () => clearTimeout(timer);
  }, [resetViewedState]);

  // Auto-sync after login
  useEffect(() => {
    const pendingSync = localStorage.getItem('pendingLoginSync');
    if (pendingSync === 'true') {
      console.log('Dashboard mounted with pendingLoginSync flag - triggering auto-sync');
      // Remove flag immediately to prevent duplicate syncs
      localStorage.removeItem('pendingLoginSync');
      // Trigger sync
      syncBets();
    }
  }, [syncBets]);

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

        <div className="w-full mb-4">
          <BetOfTheDay
            currentIndex={topCarouselIndex}
            onIndexChange={handleTopCarouselChange}
            bets={allUsersPendingBets}
            loading={betsLoading}
          />
        </div>
        
        <div className="w-full">
          <LeaderboardCarousel 
            currentIndex={bottomCarouselIndex}
            onIndexChange={handleBottomCarouselChange}
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
      </div>
      
      <BadgeAnimationHandler />
      <NotificationHandler getPortfolioRect={getPortfolioRect} />
      <FloatingSyncButton />
      <BottomNav />

      {/* SharpSports Modal for auto-sync after login */}
      {sharpSportsModal && (
        <SharpSportsModal
          url={sharpSportsModal.url}
          title={sharpSportsModal.title}
          message={sharpSportsModal.message}
          type={sharpSportsModal.type}
          onComplete={handleModalComplete}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Dashboard;
