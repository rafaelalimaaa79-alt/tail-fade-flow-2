import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep7Props {
  value: string[];
  onSelect: (data: string[]) => void;
}

const storyLines = [
  "The sharpest bettors in the world hit just 53% of their bets.",
  "Your buddy from college? He bricks bets at an 80% clip.",
  "You seem like a smart guy. So what's the move?",
  "Tail the 'sharp'… or fade your boy from college?",
  "Welcome to NoShot — the app built on fading everyone's boy from college."
];

const OnboardingStep7: React.FC<OnboardingStep7Props> = ({ onSelect }) => {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);
  const [shake, setShake] = useState(false);

  const handleSkip = () => {
    navigate('/');
  };

  const handleContinue = () => {
    if (currentLine < storyLines.length - 1) {
      const nextLine = currentLine + 1;
      setCurrentLine(nextLine);
      
      // Trigger shake animation when revealing line 2 (80%)
      if (nextLine === 1) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } else {
      // Signal completion and move to next step
      onSelect(['completed']);
    }
  };

  const formatLine = (line: string, index: number) => {
    // Emphasize numbers and key words with icy blue color
    if (index === 0) {
      return line.replace('53%', '<span class="text-[#AEE3F5] font-bold">53%</span>');
    }
    if (index === 1) {
      const shakeClass = shake ? 'animate-shake' : '';
      return line.replace('80%', `<span class="text-[#FF3B30] font-bold inline-block ${shakeClass}">80%</span>`);
    }
    if (index === 4) {
      return line.replace('NoShot', '<span class="text-[#AEE3F5] font-bold">NoShot</span>');
    }
    return line;
  };

  const isComplete = currentLine === storyLines.length - 1;

  return (
    <div className="min-h-[60vh] flex flex-col justify-between relative overflow-hidden">
      {/* Subtle background gradient that fades into black */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Story lines */}
      <div className="space-y-6 flex-1 flex flex-col justify-center relative z-10 px-2">
        {storyLines.slice(0, currentLine + 1).map((line, index) => (
          <div
            key={index}
            className={`animate-fade-in text-2xl font-medium leading-relaxed transition-opacity duration-500 ${
              index === currentLine ? 'text-white' : 'text-white/40'
            }`}
            dangerouslySetInnerHTML={{ __html: formatLine(line, index) }}
          />
        ))}
      </div>

      {/* Continue button */}
      <div className="space-y-4 mt-8 relative z-10">
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full h-16 rounded-xl bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold text-lg"
        >
          {isComplete ? (
            <span className="flex items-center justify-center gap-2">
              Let&apos;s Go <ArrowRight className="w-5 h-5" />
            </span>
          ) : (
            'Continue'
          )}
        </Button>

        <button
          onClick={handleSkip}
          className="w-full text-center text-white/60 hover:text-white/80 transition-colors underline"
        >
          Skip Onboarding
        </button>
      </div>
    </div>
  );
};

export default OnboardingStep7;
