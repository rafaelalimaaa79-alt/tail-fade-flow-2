import React, { useState } from 'react';

interface OnboardingStep6Props {
  value: string;
  onSelect: (answer: string) => void;
}

const options = [
  { id: '41', label: '41%' },
  { id: '53', label: '53%' },
  { id: '65', label: '65%' },
  { id: '72', label: '72%' },
];

const correctAnswer = '53';

const OnboardingStep6: React.FC<OnboardingStep6Props> = ({ value, onSelect }) => {
  const [hasAnswered, setHasAnswered] = useState(!!value);
  const [selectedAnswer, setSelectedAnswer] = useState(value);

  const handleAnswerClick = (answerId: string) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerId);
    setHasAnswered(true);
    onSelect(answerId);
  };

  const getButtonStyle = (optionId: string) => {
    if (!hasAnswered) {
      return 'border-white/20 bg-white/5 hover:bg-white/10';
    }
    
    if (optionId === correctAnswer) {
      return 'border-green-500 bg-green-500/20';
    }
    
    if (selectedAnswer !== correctAnswer) {
      return 'border-red-500 bg-red-500/20';
    }
    
    return 'border-white/20 bg-white/5';
  };

  return (
    <div className="min-h-[60vh] flex flex-col justify-between">
      <div className="text-left">
        <h1 className="text-3xl font-bold text-white mb-2">
          What percent of bets do you think the best bettors in the world hit at?
        </h1>
        <p className="text-white/70 text-lg mb-8">Take your best guess.</p>

        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerClick(option.id)}
              disabled={hasAnswered}
              className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 ${getButtonStyle(option.id)} ${
                hasAnswered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <span className="text-white text-lg font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep6;
