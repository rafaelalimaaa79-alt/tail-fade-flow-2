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
      {/* Left Arrow - moved inside the block */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      {/* Right Arrow - moved inside the block */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

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
        <CarouselContent className="w-full">
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
