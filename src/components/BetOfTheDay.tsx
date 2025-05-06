
import React, { useRef, useEffect } from "react";
import WaveText from "./WaveText";
import PlayCard from "./PlayCard";
import PaginationIndicator from "./PaginationIndicator";
import { playsOfTheDay } from "@/types/betTypes";
import useWaveAnimation from "@/hooks/useWaveAnimation";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";

interface BetOfTheDayProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const BetOfTheDay = ({ currentIndex, onIndexChange }: BetOfTheDayProps) => {
  // Configure Embla carousel for smooth, natural-looking transitions
  const emblaOptions: EmblaOptionsType = {
    loop: true,
    align: "center",
    dragFree: false,
    containScroll: "trimSnaps",
    skipSnaps: false,
    speed: 25, // Lower number = slower, more visible animation
    startIndex: currentIndex % playsOfTheDay.length,
    duration: 700, // Longer duration for more visible animation
  };
  
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const navigate = useNavigate();
  const isAnimating = useRef(false);
  const lastIndexRef = useRef(currentIndex);
  
  // Use the improved hook with custom options
  const { animationPosition, activeLine } = useWaveAnimation({
    totalDuration: 2500,
    lineChangePoint: 0.5,
    pauseDuration: 300
  });
  
  // Setup embla carousel to sync with the current index
  useEffect(() => {
    if (!emblaApi) return;
    
    // Only animate if the index has actually changed
    if (lastIndexRef.current !== currentIndex) {
      isAnimating.current = true;
      
      // Ensure smooth transition animation
      emblaApi.scrollTo(currentIndex % playsOfTheDay.length, true);
      
      // Reset animation flag after the animation completes
      setTimeout(() => {
        isAnimating.current = false;
        lastIndexRef.current = currentIndex;
      }, 750); // Slightly longer than animation duration
    }
    
    console.log('BetOfTheDay currentIndex:', currentIndex, 'Current Play:', playsOfTheDay[currentIndex % playsOfTheDay.length]);
  }, [currentIndex, emblaApi]);
  
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

  // Handle next play
  const nextPlay = () => {
    if (isAnimating.current) return;
    const nextIndex = (currentIndex + 1) % playsOfTheDay.length;
    onIndexChange(nextIndex);
  };
  
  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating.current) return;
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };
  
  const handleSwipe = () => {
    // Threshold for swipe detection (minimum 50px horizontal movement)
    const threshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) < threshold) return;
    
    // We only want left swipes (next slide)
    if (diff > 0) {
      nextPlay();
    }
  };
  
  // Navigate to leaders page based on type
  const navigateToLeaders = (type: 'tail' | 'fade') => {
    navigate(`/leaders?type=${type}`);
  };
  
  useEffect(() => {
    if (!emblaApi) return;
    
    // Add event listener to update the index when the carousel is scrolled
    const onSelect = () => {
      if (!isAnimating.current) {
        const selectedSnap = emblaApi.selectedScrollSnap();
        if (currentIndex % playsOfTheDay.length !== selectedSnap) {
          // Here we ensure we're only moving forward (left swipe)
          if (selectedSnap > currentIndex % playsOfTheDay.length || 
             (selectedSnap === 0 && currentIndex % playsOfTheDay.length === playsOfTheDay.length - 1)) {
            onIndexChange(currentIndex + 1);
          }
        }
      }
    };
    
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, currentIndex, onIndexChange]);
  
  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="transition-all duration-700"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex transition-transform">
          {playsOfTheDay.map((play, idx) => (
            <div 
              key={idx} 
              className="min-w-0 flex-[0_0_100%] px-2 transition-transform duration-700"
            >
              <PlayCard 
                play={play}
                renderWaveText={renderWaveText}
                onActionClick={() => navigateToLeaders(play.suggestionType === 'fade' ? 'fade' : 'tail')}
              />
            </div>
          ))}
        </div>
      </div>
      <PaginationIndicator 
        currentIndex={currentIndex % playsOfTheDay.length} 
        totalItems={playsOfTheDay.length} 
      />
    </div>
  );
};

export default BetOfTheDay;
