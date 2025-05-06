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
  // Configure Embla carousel with improved centering and slower transition settings
  const emblaOptions: EmblaOptionsType = {
    loop: true,
    align: "center", // Perfect center alignment
    dragFree: false,
    containScroll: "trimSnaps",
    skipSnaps: false,
    startIndex: currentIndex % playsOfTheDay.length,
    duration: 2000, // Slower animation duration
    slidesToScroll: 1,
    inViewThreshold: 1,
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
      
      // Ensure smooth transition animation with better centering
      emblaApi.scrollTo(currentIndex % playsOfTheDay.length, true);
      emblaApi.reInit(emblaOptions);
      
      // Reset animation flag after the animation completes
      setTimeout(() => {
        isAnimating.current = false;
        lastIndexRef.current = currentIndex;
      }, 2100); // Slightly longer than animation duration
    }
    
    console.log('BetOfTheDay currentIndex:', currentIndex, 'Current Play:', playsOfTheDay[currentIndex % playsOfTheDay.length]);
  }, [currentIndex, emblaApi, emblaOptions]);
  
  // Function to navigate to leaders page
  const navigateToLeaders = (type: 'tail' | 'fade') => {
    navigate(`/leaders?type=${type}`);
  };
  
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
  
  useEffect(() => {
    if (!emblaApi) return;
    
    // Ensure the carousel is perfectly centered after any manipulation
    const centerCarousel = () => {
      emblaApi.reInit();
    };
    
    // Add event listener to center the carousel
    emblaApi.on('settle', centerCarousel);
    
    // Add event listener to update the index when the carousel is scrolled
    const onSelect = () => {
      if (!isAnimating.current) {
        const selectedSnap = emblaApi.selectedScrollSnap();
        if (currentIndex % playsOfTheDay.length !== selectedSnap) {
          // Here we ensure we're only moving forward (left swipe)
          if (selectedSnap > currentIndex % playsOfTheDay.length || 
             (selectedSnap === 0 && currentIndex % playsOfTheDay.length === playsOfTheDay.length - 1)) {
            onIndexChange(selectedSnap);
          }
        }
      }
    };
    
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('settle', centerCarousel);
    };
  }, [emblaApi, currentIndex, onIndexChange]);
  
  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="transition-all duration-2000 w-full mx-auto px-1" 
    >
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex w-full transition-transform duration-2000"> 
          {playsOfTheDay.map((play, idx) => (
            <div 
              key={idx} 
              className="min-w-full flex-none px-1 transition-transform duration-2000" 
              style={{
                transform: `translateX(${idx === currentIndex % playsOfTheDay.length ? '0' : '100%'})`,
              }}
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
