
import React, { useRef, useEffect } from "react";
import WaveText from "./WaveText";
import PlayCard from "./PlayCard";
import PaginationIndicator from "./PaginationIndicator";
import { playsOfTheDay } from "@/types/betTypes";
import useWaveAnimation from "@/hooks/useWaveAnimation";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";

interface BetOfTheDayProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const BetOfTheDay = ({ currentIndex, onIndexChange }: BetOfTheDayProps) => {
  // Always slide from right to left with a smooth transition
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start", 
    direction: "ltr", // ensures left-to-right DOM order
    dragFree: false,
    slidesToScroll: 1,
    duration: 800, // Slower animation for book-flip feel (higher number = slower)
    watchDrag: false, // Disable drag movement watching during animation
  });
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const navigate = useNavigate();
  const isAnimating = useRef(false);
  
  // Use the improved hook with custom options
  const { animationPosition, activeLine } = useWaveAnimation({
    totalDuration: 2500,
    lineChangePoint: 0.5,
    pauseDuration: 300
  });
  
  // Setup embla carousel to sync with the current index
  useEffect(() => {
    if (!emblaApi || isAnimating.current) return;
    
    if (emblaApi.selectedScrollSnap() !== currentIndex % playsOfTheDay.length) {
      isAnimating.current = true;
      
      // Create a page-turning effect by animating the transition
      emblaApi.scrollTo(currentIndex % playsOfTheDay.length, true);
      
      // Reset animation flag after the animation completes
      setTimeout(() => {
        isAnimating.current = false;
      }, 900); // Slightly longer than animation duration
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
  
  // Handle previous play
  const prevPlay = () => {
    if (isAnimating.current) return;
    const prevIndex = currentIndex === 0 ? playsOfTheDay.length - 1 : currentIndex - 1;
    onIndexChange(prevIndex);
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
    
    if (diff > 0) {
      // Swipe left, go to next
      nextPlay();
    } else {
      // Swipe right, go to previous
      prevPlay();
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
      if (isAnimating.current) return;
      
      const currentSlide = emblaApi.selectedScrollSnap();
      if (currentIndex % playsOfTheDay.length !== currentSlide) {
        onIndexChange(currentSlide);
      }
    };
    
    emblaApi.on('select', onSelect);
    
    // Return the cleanup function directly
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, currentIndex, onIndexChange]);
  
  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="transition-all duration-500"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {playsOfTheDay.map((play, idx) => (
            <div 
              key={idx} 
              className="min-w-0 flex-[0_0_100%] pl-0 transition-transform duration-700"
              style={{ 
                perspective: '1000px'
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
