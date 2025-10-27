import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WaveText from "./WaveText";
import FadeWatchCard from "./FadeWatchCard";
import PaginationIndicator from "./PaginationIndicator";
import { PendingBetWithStatline } from "@/hooks/usePendingBets";
import { AllUsersPendingBet } from "@/hooks/useAllUsersPendingBets";
import useWaveAnimation from "@/hooks/useWaveAnimation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { triggerHaptic } from "@/utils/haptic-feedback";

interface BetOfTheDayProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  bets: PendingBetWithStatline[] | AllUsersPendingBet[];
  loading: boolean;
}

const BetOfTheDay = ({ currentIndex, onIndexChange, bets, loading }: BetOfTheDayProps) => {
  const { animationPosition, activeLine } = useWaveAnimation({
    totalDuration: 4000,
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

  // Reset carousel to index 0 when bets change or current index is out of bounds
  React.useEffect(() => {
    if (!api || loading) return;

    // If current index is out of bounds (bet was removed), reset to 0
    if (bets.length > 0 && currentIndex >= bets.length) {
      console.log(`Current index ${currentIndex} out of bounds (${bets.length} bets), resetting to 0`);
      api.scrollTo(0);
      onIndexChange(0);
    }
  }, [bets.length, currentIndex, api, loading, onIndexChange]);

  // Navigation functions
  const goToPrevious = () => {
    triggerHaptic('selectionChanged');
    if (api) {
      api.scrollPrev();
    }
  };

  const goToNext = () => {
    triggerHaptic('selectionChanged');
    if (api) {
      api.scrollNext();
    }
  };

  // Check if arrows should be disabled
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === bets.length - 1;

  // All bets are fade recommendations
  const isFade = true;

  const renderWaveText = (text: string, lineIndex: number) => {
    return (
      <WaveText
        text={text}
        lineIndex={lineIndex}
        activeLine={activeLine}
        animationPosition={animationPosition}
        isFade={isFade}
        waveWidth={0.5} // Updated to use the new wider wave width
        maxScale={0.25}
        maxGlow={10}
      />
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full mx-auto px-2 relative">
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-[#AEE3F5] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading fade recommendations...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (bets.length === 0) {
    return (
      <div className="w-full mx-auto px-2 relative">
        <div className="mb-4 text-center">
          <h2 className="font-exo text-4xl font-bold tracking-wider uppercase">
            {renderWaveText("FADE WATCH", 0)}
          </h2>
        </div>
        <div className="bg-black rounded-xl p-6 border border-[#AEE3F5]/30 text-center">
          <p className="text-gray-400 text-lg mb-2">No pending bets</p>
          <p className="text-gray-500 text-sm">Sync your sportsbook to see fade recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-2 relative">
      {/* Left Arrow - disabled on first slide */}
      <button
        onClick={goToPrevious}
        disabled={isFirstSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm rounded-full p-2 transition-all duration-200 ${
          isFirstSlide
            ? 'bg-white/5 cursor-not-allowed opacity-40'
            : 'bg-white/10 hover:bg-white/20 hover:scale-110 cursor-pointer'
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className={`h-5 w-5 ${isFirstSlide ? 'text-gray-500' : 'text-white'}`} />
      </button>

      {/* Right Arrow - disabled on last slide */}
      <button
        onClick={goToNext}
        disabled={isLastSlide}
        className={`absolute right-6 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm rounded-full p-2 transition-all duration-200 ${
          isLastSlide
            ? 'bg-white/5 cursor-not-allowed opacity-40'
            : 'bg-white/10 hover:bg-white/20 hover:scale-110 cursor-pointer'
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className={`h-5 w-5 ${isLastSlide ? 'text-gray-500' : 'text-white'}`} />
      </button>

      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          startIndex: currentIndex % bets.length,
          watchDrag: false, // Disable dragging/swiping
          duration: 25, // Reset to default smooth transition
        }}
        setApi={setApi}
      >
        <CarouselContent className="w-full">
          {bets.map((bet, idx) => (
            <CarouselItem key={bet.id || idx} className="w-full">
              <FadeWatchCard
                bet={bet}
                renderWaveText={renderWaveText}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <PaginationIndicator
        currentIndex={currentIndex % bets.length}
        totalItems={bets.length}
      />
    </div>
  );
};

export default BetOfTheDay;
