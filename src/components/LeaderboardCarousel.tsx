
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";

interface LeaderboardCarouselProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

// Limit to 4 bettors for each category
const hottestBettors = [
  { id: "1", name: "Mike", profit: 1840, streak: [1, 1, 1, 1, 0] }, // 1=win, 0=loss
  { id: "2", name: "Sarah", profit: 1570, streak: [1, 1, 1, 0, 1] },
  { id: "3", name: "Chris", profit: 1320, streak: [1, 1, 0, 1, 1] },
  { id: "4", name: "Taylor", profit: 1180, streak: [0, 1, 1, 1, 1] },
];

const coldestBettors = [
  { id: "6", name: "Kevin", profit: -1650, streak: [0, 0, 0, 0, 1] }, // 1=win, 0=loss
  { id: "7", name: "Lisa", profit: -1490, streak: [0, 0, 0, 1, 0] },
  { id: "8", name: "Ryan", profit: -1250, streak: [1, 0, 0, 0, 0] },
  { id: "9", name: "Emily", profit: -1100, streak: [0, 1, 0, 0, 0] },
];

const LeaderboardCarousel = ({ currentIndex, onIndexChange }: LeaderboardCarouselProps) => {
  // Configure Embla carousel with improved mobile-first centering and slower transitions
  const emblaOptions: EmblaOptionsType = {
    loop: true,
    align: "center", // Perfect center alignment
    dragFree: false,
    skipSnaps: false,
    containScroll: "trimSnaps",
    startIndex: currentIndex % 2,
    duration: 1600, // Slower transitions
    slidesToScroll: 1,
    inViewThreshold: 1,
  };
  
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
  
  const navigate = useNavigate();
  const isAnimating = useRef(false);
  const lastIndexRef = useRef(currentIndex);
  
  // Function to handle navigation to leaders page
  const navigateToLeaders = (type: 'tail' | 'fade') => {
    navigate(`/leaders?type=${type}`);
  };
  
  // Set up embla carousel with improved animation handling for mobile
  useEffect(() => {
    if (!emblaApi) return;
    
    // Only animate if index has changed
    if (lastIndexRef.current !== currentIndex) {
      isAnimating.current = true;
      
      // Create a visible, smooth animation effect with better centering
      emblaApi.scrollTo(currentIndex % 2, true);
      emblaApi.reInit(emblaOptions);
      
      // Reset animation flag after the animation completes
      setTimeout(() => {
        isAnimating.current = false;
        lastIndexRef.current = currentIndex;
      }, 1700); // Slightly longer than animation duration
    }
    
    // Ensure the carousel is perfectly centered
    const centerCarousel = () => {
      emblaApi.reInit();
    };
    
    // Add event listener to center the carousel
    emblaApi.on('settle', centerCarousel);
    
    // Handle manual user swipe events
    const onSelect = () => {
      if (!isAnimating.current) {
        const selectedSnap = emblaApi.selectedScrollSnap();
        onIndexChange(selectedSnap);
      }
    };

    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('settle', centerCarousel);
    };
    
  }, [currentIndex, emblaApi, onIndexChange, emblaOptions]);

  return (
    <div className="w-full transition-all duration-1600 px-1"> 
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex w-full transition-transform duration-1600"> 
          {/* Hot Bettors */}
          <div className="min-w-full flex-none px-1 transition-transform duration-1600" 
               style={{
                 transform: `translateX(${currentIndex % 2 === 0 ? '0' : '100%'})`,
               }}>
            <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
              <div className="mb-4 flex items-center justify-center">
                <h3 className="text-lg font-bold text-white/90">These guys can't miss</h3>
              </div>
              
              <div className="space-y-1">
                {hottestBettors.map((bettor) => (
                  <BettorStreakItem
                    key={bettor.id}
                    id={bettor.id}
                    name={bettor.name}
                    profit={bettor.profit}
                    streak={bettor.streak}
                  />
                ))}
              </div>
              
              <ActionButton 
                variant="tail" 
                className="mt-4 h-10 text-sm"
                onClick={() => navigateToLeaders('tail')}
              >
                View Tail Leaders
              </ActionButton>
            </div>
          </div>

          {/* Cold Bettors */}
          <div className="min-w-full flex-none px-1 transition-transform duration-1600"
               style={{
                 transform: `translateX(${currentIndex % 2 === 1 ? '0' : '100%'})`,
               }}>
            <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
              <div className="mb-4 flex items-center justify-center">
                <h3 className="text-lg font-bold text-white/90">Can't buy a win right now</h3>
              </div>
              
              <div className="space-y-1">
                {coldestBettors.map((bettor) => (
                  <BettorStreakItem
                    key={bettor.id}
                    id={bettor.id}
                    name={bettor.name}
                    profit={bettor.profit}
                    streak={bettor.streak}
                  />
                ))}
              </div>
              
              <ActionButton 
                variant="fade" 
                className="mt-4 h-10 text-sm"
                onClick={() => navigateToLeaders('fade')}
              >
                View Fade Leaders
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCarousel;
