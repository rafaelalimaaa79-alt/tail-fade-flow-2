
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";

interface LeaderboardCarouselProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const coldestBettors = [
  { id: "10", name: "Alex", profit: -2100, streak: [0, 0, 0, 0, 0] },
  { id: "11", name: "Sam", profit: -1890, streak: [0, 0, 0, 1, 0] },
  { id: "12", name: "Jordan", profit: -1750, streak: [1, 0, 0, 0, 0] },
  { id: "13", name: "Casey", profit: -1680, streak: [0, 1, 0, 0, 0] },
  { id: "14", name: "Taylor", profit: -1590, streak: [0, 0, 1, 0, 0] },
  { id: "15", name: "Morgan", profit: -1420, streak: [0, 0, 0, 0, 1] },
  { id: "16", name: "Blake", profit: -1350, streak: [1, 0, 0, 1, 0] },
  { id: "17", name: "Riley", profit: -1280, streak: [0, 1, 0, 0, 0] },
  { id: "18", name: "Avery", profit: -1190, streak: [0, 0, 0, 1, 0] },
  { id: "19", name: "Quinn", profit: -1050, streak: [1, 0, 0, 0, 0] },
];

const LeaderboardCarousel = ({ currentIndex, onIndexChange }: LeaderboardCarouselProps) => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const itemsToShow = 5;
  const totalItems = coldestBettors.length;
  
  // Function to handle navigation to leaders page
  const navigateToLeaders = (type: 'fade') => {
    navigate(`/leaders?type=${type}`);
  };

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prevPosition => {
        const maxPosition = totalItems - itemsToShow;
        if (prevPosition >= maxPosition) {
          // If at the bottom, go back to top
          return 0;
        }
        // Move down by 1
        return prevPosition + 1;
      });
    }, 2000); // Scroll every 2 seconds

    return () => clearInterval(interval);
  }, [totalItems, itemsToShow]);

  // Get visible bettors based on scroll position
  const visibleBettors = coldestBettors.slice(scrollPosition, scrollPosition + itemsToShow);
  
  return (
    <div className="w-full px-2"> 
      <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
        <div className="mb-4 flex items-center justify-center">
          <h3 className="text-lg font-bold text-white/90">Can't Buy a Win</h3>
        </div>
        
        <div className="overflow-hidden">
          <div 
            className="space-y-1 transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateY(0px)` // Smooth transition handled by changing visible items
            }}
          >
            {visibleBettors.map((bettor, index) => (
              <BettorStreakItem
                key={`${bettor.id}-${scrollPosition}`}
                id={bettor.id}
                name={bettor.name}
                profit={bettor.profit}
                streak={bettor.streak}
              />
            ))}
          </div>
        </div>
        
        <ActionButton 
          variant="fade" 
          className="mt-4 h-10 text-sm"
          onClick={() => navigateToLeaders('fade')}
        >
          View Coldest Picks
        </ActionButton>
      </div>
    </div>
  );
};

export default LeaderboardCarousel;
