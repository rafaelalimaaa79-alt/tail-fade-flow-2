
import React, { useRef, useEffect } from "react";
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
    totalDuration: 1500, // Reduced from 2500ms to 1500ms for faster animations
    lineChangePoint: 0.5,
    pauseDuration: 200  // Reduced from 300ms to 200ms for quicker transitions
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
    
    // Subscribe to carousel events
    api.on("select", handleSelect);
    
    // Cleanup
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onIndexChange]);
  
  const isFade = playsOfTheDay[currentIndex % playsOfTheDay.length].suggestionType === "fade";
  
  // Render the wave text with improved component
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
    <div className="w-full mx-auto px-2">
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          startIndex: currentIndex % playsOfTheDay.length,
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
