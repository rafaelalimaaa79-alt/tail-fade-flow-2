
import React, { useEffect, useState, useCallback } from "react";
import { Flame, Snowflake } from "lucide-react";
import BettorStreakItem from "./BettorStreakItem";
import ActionButton from "./ActionButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

// Mock data - this would come from an API in a real app
const hottestBettors = [
  { id: "1", name: "Mike", profit: 1840, streak: [1, 1, 1, 1, 0] }, // 1=win, 0=loss
  { id: "2", name: "Sarah", profit: 1570, streak: [1, 1, 1, 0, 1] },
  { id: "3", name: "Chris", profit: 1320, streak: [1, 1, 0, 1, 1] },
  { id: "4", name: "Taylor", profit: 1180, streak: [0, 1, 1, 1, 1] },
  { id: "5", name: "Jordan", profit: 980, streak: [1, 0, 1, 1, 1] },
];

const coldestBettors = [
  { id: "6", name: "Kevin", profit: -1650, streak: [0, 0, 0, 0, 1] }, // 1=win, 0=loss
  { id: "7", name: "Lisa", profit: -1490, streak: [0, 0, 0, 1, 0] },
  { id: "8", name: "Ryan", profit: -1250, streak: [1, 0, 0, 0, 0] },
  { id: "9", name: "Emily", profit: -1100, streak: [0, 1, 0, 0, 0] },
  { id: "10", name: "Alex", profit: -970, streak: [0, 0, 1, 0, 0] },
];

const LeaderboardCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [activeIndex, setActiveIndex] = useState(0);
  
  const updateActiveIndex = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  useEffect(() => {
    if (!emblaApi) return;
    
    updateActiveIndex();
    emblaApi.on("select", updateActiveIndex);
    
    // Auto-rotate between hot and cold leaderboards every 3 seconds
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
    
    return () => {
      emblaApi.off("select", updateActiveIndex);
      clearInterval(interval);
    };
  }, [emblaApi, updateActiveIndex]);

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {/* Hot Bettors */}
          <div className="min-w-0 flex-[0_0_100%] pl-0">
            <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
              <div className="mb-4 flex items-center">
                <Flame className="mr-2 h-5 w-5 text-onetime-orange" />
                <h3 className="text-base font-bold text-white/90">These guys can't miss</h3>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto space-y-1">
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
              
              <ActionButton variant="tail" className="mt-4 h-10 text-sm">
                Tail All
              </ActionButton>
            </div>
          </div>

          {/* Cold Bettors */}
          <div className="min-w-0 flex-[0_0_100%] pl-4">
            <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10">
              <div className="mb-4 flex items-center">
                <Snowflake className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-white/90">Can't buy a win right now</h3>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto space-y-1">
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
              
              <ActionButton variant="fade" className="mt-4 h-10 text-sm">
                Fade All
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCarousel;
