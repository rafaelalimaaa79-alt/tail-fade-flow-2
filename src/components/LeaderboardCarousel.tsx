
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
  const navigate = useNavigate();
  
  // Function to handle navigation to leaders page
  const navigateToLeaders = (type: 'tail' | 'fade') => {
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
          {/* Hot Bettors */}
          <CarouselItem>
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
          </CarouselItem>

          {/* Cold Bettors */}
          <CarouselItem>
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
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default LeaderboardCarousel;
