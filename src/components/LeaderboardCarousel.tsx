
import React from "react";
import { useNavigate } from "react-router-dom";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface LeaderboardCarouselProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

// Updated to show cold bettors as fade bait
const fadeBaitBettors = [
  { id: "6", name: "Kevin", profit: -1650, streak: [0, 0, 0, 0, 1] }, // 1=win, 0=loss
  { id: "7", name: "Lisa", profit: -1490, streak: [0, 0, 0, 1, 0] },
  { id: "8", name: "Ryan", profit: -1250, streak: [1, 0, 0, 0, 0] },
  { id: "9", name: "Emily", profit: -1100, streak: [0, 1, 0, 0, 0] },
];

const coldestBettors = [
  { id: "10", name: "Alex", profit: -2100, streak: [0, 0, 0, 0, 0] },
  { id: "11", name: "Sam", profit: -1890, streak: [0, 0, 0, 1, 0] },
  { id: "12", name: "Jordan", profit: -1750, streak: [1, 0, 0, 0, 0] },
  { id: "13", name: "Casey", profit: -1680, streak: [0, 1, 0, 0, 0] },
];

const LeaderboardCarousel = ({ currentIndex, onIndexChange }: LeaderboardCarouselProps) => {
  const navigate = useNavigate();
  
  // Function to handle navigation to leaders page
  const navigateToLeaders = (type: 'fade') => {
    navigate(`/leaders?type=${type}`);
  };
  
  // Set up the carousel API
  const [api, setApi] = React.useState<any>(null);
  
  // When the currentIndex changes from outside (like auto-rotation),
  // make sure our carousel reflects that
  React.useEffect(() => {
    if (api) {
      api.scrollTo(currentIndex % 2);
    }
  }, [api, currentIndex]);
  
  // When user scrolls the carousel, update our index
  React.useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      onIndexChange(selectedIndex);
    };
    
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onIndexChange]);
  
  return (
    <div className="w-full px-2"> 
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent>
          {/* Fade Bait Bettors */}
          <CarouselItem>
            <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
              <div className="mb-4 flex items-center justify-center">
                <h3 className="text-lg font-bold text-white/90">Perfect fade bait</h3>
              </div>
              
              <div className="space-y-1">
                {fadeBaitBettors.map((bettor) => (
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
          </CarouselItem>

          {/* Coldest Bettors */}
          <CarouselItem>
            <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
              <div className="mb-4 flex items-center justify-center">
                <h3 className="text-lg font-bold text-white/90">Ice cold right now</h3>
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
                View Coldest Picks
              </ActionButton>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default LeaderboardCarousel;
