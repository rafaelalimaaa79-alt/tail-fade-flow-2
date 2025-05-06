
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", direction: "ltr" });
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const navigate = useNavigate();
  
  // Use the improved hook with custom options
  const { animationPosition, activeLine } = useWaveAnimation({
    totalDuration: 2500,  // Reduced from 3500ms to 2500ms (1 second faster)
    lineChangePoint: 0.5,
    pauseDuration: 300
  });
  
  // Setup embla carousel to sync with the current index
  useEffect(() => {
    if (!emblaApi) return;
    
    if (emblaApi.selectedScrollSnap() !== currentIndex % playsOfTheDay.length) {
      emblaApi.scrollTo(currentIndex % playsOfTheDay.length);
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
        waveWidth={0.4}  // Wider wave effect
        maxScale={0.25}  // Slightly reduced scale for smoother animation
        maxGlow={10}     // Adjusted glow intensity
      />
    );
  };

  // Handle next play
  const nextPlay = () => {
    const nextIndex = (currentIndex + 1) % playsOfTheDay.length;
    onIndexChange(nextIndex);
  };
  
  // Handle previous play
  const prevPlay = () => {
    const prevIndex = currentIndex === 0 ? playsOfTheDay.length - 1 : currentIndex - 1;
    onIndexChange(prevIndex);
  };
  
  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
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
  
  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {playsOfTheDay.map((play, idx) => (
            <div key={idx} className="min-w-0 flex-[0_0_100%] pl-0">
              {idx === currentIndex % playsOfTheDay.length && (
                <PlayCard 
                  play={play}
                  renderWaveText={renderWaveText}
                  onActionClick={() => navigateToLeaders(play.suggestionType === 'fade' ? 'fade' : 'tail')}
                />
              )}
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
