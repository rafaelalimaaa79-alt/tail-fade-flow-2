
import React from "react";
import { useNavigate } from "react-router-dom";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";

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

const LeaderboardCarousel = ({ currentIndex }: LeaderboardCarouselProps) => {
  const navigate = useNavigate();
  
  // Function to handle navigation to leaders page
  const navigateToLeaders = (type: 'tail' | 'fade') => {
    navigate(`/leaders?type=${type}`);
  };

  return (
    <div className="w-full px-4"> 
      {/* Hot Bettors */}
      <div className={`w-full ${currentIndex % 2 === 0 ? 'block' : 'hidden'}`}>
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
      <div className={`w-full ${currentIndex % 2 === 1 ? 'block' : 'hidden'}`}>
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
  );
};

export default LeaderboardCarousel;
