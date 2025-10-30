import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep7Props {
  value: string[];
  onSelect: (data: string[]) => void;
  onBack?: () => void;
}

const storyLines = [
  "The sharpest bettors in the world hit just 53% of their bets.",
  "Your buddy from college? He bricks bets at an 80% clip.",
  "You seem like a smart guy. So what's the move?",
  "Tail the 'sharp'… or fade your boy from college?",
  "Welcome to NoShot — the app built on fading everyone's boy from college."
];

const OnboardingStep7: React.FC<OnboardingStep7Props> = ({ onSelect, onBack }) => {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);
  const [shake, setShake] = useState(false);

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
    <div className="fixed inset-0 flex flex-col justify-between p-4 pt-16 pb-8 overflow-hidden">
      {/* Story lines */}
      <div className="space-y-6 flex-1 flex flex-col justify-center px-2">
        {storyLines.slice(0, currentLine + 1).map((line, index) => (
          <div
            key={index}
            className={`animate-fade-in text-2xl font-bold leading-relaxed transition-opacity duration-500 ${
              index === currentLine ? 'text-white' : 'text-white/40'
            }`}
            dangerouslySetInnerHTML={{ __html: formatLine(line, index) }}
          />
        ))}
      </div>

      {/* Continue button */}
      <div className="space-y-4">
        <div className="flex gap-3">
          {onBack && currentLine === 0 && (
            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </Button>
          )}
          
          <Button
            onClick={handleContinue}
            size="lg"
            className="flex-1 h-16 rounded-xl bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold text-lg"
          >
            {isComplete ? (
              <span className="flex items-center justify-center gap-2">
                Let&apos;s Go <ArrowRight className="w-5 h-5" />
              </span>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep7;
