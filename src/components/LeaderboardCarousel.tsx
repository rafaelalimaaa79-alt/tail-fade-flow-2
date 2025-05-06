
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";
import useEmblaCarousel from "embla-carousel-react";
import { playsOfTheDay } from "@/types/betTypes";

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
  // Updated carousel settings for proper horizontal slide animation
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    dragFree: false,
    skipSnaps: false,
    containScroll: "trimSnaps",
    direction: "ltr",
    duration: 800, // Smoother animation duration for page-turning effect
  });
  
  const navigate = useNavigate();
  const isAnimating = useRef(false);
  
  // Function to handle navigation to leaders page
  const navigateToLeaders = (type: 'tail' | 'fade') => {
    navigate(`/leaders?type=${type}`);
  };
  
  // Set up embla carousel
  useEffect(() => {
    if (!emblaApi || isAnimating.current) return;
    
    // Calculate whether to show hot or cold bettors based on currentIndex
    // We alternate between hot (0) and cold (1) based on even/odd in playsOfTheDay
    const selectedIndex = currentIndex % 2;
    
    if (emblaApi.selectedScrollSnap() !== selectedIndex) {
      isAnimating.current = true;
      
      // Create a proper slide animation effect
      emblaApi.scrollTo(selectedIndex, true);
      
      // Reset animation flag after the animation completes
      setTimeout(() => {
        isAnimating.current = false;
      }, 850); // Slightly longer than animation duration
    }
    
    // Handle manual user swipe events
    const onSelect = () => {
      if (!isAnimating.current) {
        const selectedSnap = emblaApi.selectedScrollSnap();
        const newIndex = currentIndex % 2 === selectedSnap ? currentIndex : (currentIndex % playsOfTheDay.length) + (selectedSnap - currentIndex % 2);
        onIndexChange(newIndex);
      }
    };

    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
    
  }, [currentIndex, emblaApi, onIndexChange]);

  return (
    <div className="w-full transition-all duration-800">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {/* Hot Bettors */}
          <div className="min-w-0 flex-[0_0_100%] px-2 transition-transform duration-800">
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
          <div className="min-w-0 flex-[0_0_100%] px-2 transition-transform duration-800">
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
