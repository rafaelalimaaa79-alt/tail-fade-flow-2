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
    // Emphasize numbers
    if (index === 0) {
      return line.replace('53%', '<span class="text-[#0EA5E9] font-bold">53%</span>');
    }
    if (index === 1) {
      const shakeClass = shake ? 'animate-shake' : '';
      return line.replace('80%', `<span class="text-red-500 font-bold inline-block ${shakeClass}">80%</span>`);
    }
    return line;
  };

  const isComplete = currentLine === storyLines.length - 1;

  return (
    <div className="min-h-[60vh] flex flex-col justify-between">
      {/* Story lines */}
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {storyLines.slice(0, currentLine + 1).map((line, index) => (
          <div
            key={index}
            className="animate-fade-in text-white text-2xl font-bold leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatLine(line, index) }}
          />
        ))}
      </div>

      {/* Continue button */}
      <div className="space-y-4 mt-8">
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full h-16 rounded-xl bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold text-lg"
        >
          {isComplete ? (
            <span className="flex items-center justify-center gap-2">
              Let's Go <ArrowRight className="w-5 h-5" />
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
