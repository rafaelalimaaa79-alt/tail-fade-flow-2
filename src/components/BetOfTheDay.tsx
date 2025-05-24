
import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WaveText from "./WaveText";
import PlayCard from "./PlayCard";
import PaginationIndicator from "./PaginationIndicator";
import { playsOfTheDay } from "@/types/betTypes";
import useWaveAnimation from "@/hooks/useWaveAnimation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface BetOfTheDayProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const BetOfTheDay = ({ currentIndex, onIndexChange }: BetOfTheDayProps) => {
  const { animationPosition, activeLine } = useWaveAnimation({
    totalDuration: 2000,
    lineChangePoint: 0.5,
    pauseDuration: 200
  });
  
  // Track carousel API
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  
  // Update the current index when the carousel changes
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
  
  // Navigation functions
  const goToPrevious = () => {
    if (api) {
      api.scrollPrev();
    }
  };
  
  const goToNext = () => {
    if (api) {
      api.scrollNext();
    }
  };
  
  const isFade = playsOfTheDay[currentIndex % playsOfTheDay.length].suggestionType === "fade";
  
  const renderWaveText = (text: string, lineIndex: number) => {
    return (
      <WaveText
        text={text}
        lineIndex={lineIndex}
        activeLine={activeLine}
        animationPosition={animationPosition}
        isFade={isFade}
        waveWidth={0.4}
        maxScale={0.25}
        maxGlow={10}
      />
    );
  };

  return (
    <div className="w-full mx-auto px-2 relative">
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          startIndex: currentIndex % playsOfTheDay.length,
          watchDrag: false, // Disable dragging/swiping
          duration: 25, // Reset to default smooth transition
        }}
        setApi={setApi}
      >
        <CarouselContent className="w-full relative">
          {/* Cool Navigation Arrows Inside */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 
                     bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600
                     backdrop-blur-md rounded-full p-3 
                     transition-all duration-300 ease-out
                     hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50
                     border border-white/20 hover:border-white/40
                     group active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 
                     bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600
                     backdrop-blur-md rounded-full p-3 
                     transition-all duration-300 ease-out
                     hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50
                     border border-white/20 hover:border-white/40
                     group active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {playsOfTheDay.map((play, idx) => (
            <CarouselItem key={idx} className="w-full">
              <PlayCard 
                play={play}
                renderWaveText={renderWaveText}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <PaginationIndicator 
        currentIndex={currentIndex % playsOfTheDay.length} 
        totalItems={playsOfTheDay.length} 
      />
    </div>
  );
};

export default BetOfTheDay;
