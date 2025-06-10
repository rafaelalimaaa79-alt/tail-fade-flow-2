
import React from "react";
import { useNavigate } from "react-router-dom";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";
import { Separator } from "./ui/separator";

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
];

const LeaderboardCarousel = ({ currentIndex, onIndexChange }: LeaderboardCarouselProps) => {
  const navigate = useNavigate();
  
  // Function to handle navigation to leaders page
  const navigateToLeaders = (type: 'fade') => {
    navigate(`/leaders?type=${type}`);
  };
  
  return (
    <div className="w-full px-2"> 
      <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-[#AEE3F5] font-exo uppercase tracking-wide text-center mb-3">
            Can't Buy a Win
          </h3>
          <Separator className="bg-[#AEE3F5]/30" />
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
          View All Cold Bettors
        </ActionButton>
      </div>
    </div>
  );
};

export default LeaderboardCarousel;
