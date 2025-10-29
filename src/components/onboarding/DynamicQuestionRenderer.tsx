import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OnboardingHeader from './OnboardingHeader';
import {
  OnboardingQuestion,
  OnboardingOption,
  saveLocalAnswer,
  getLocalAnswer,
} from '@/services/dynamicOnboardingService';

interface DynamicQuestionRendererProps {
  question: OnboardingQuestion;
  options: OnboardingOption[];
  onNext: () => void;
}

const DynamicQuestionRenderer: React.FC<DynamicQuestionRendererProps> = ({
  question,
  options,
  onNext,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [textValue, setTextValue] = useState<string>('');

  // Load existing answer on mount
  useEffect(() => {
    const existingAnswer = getLocalAnswer(question.id);
    if (existingAnswer) {
      if (question.question_type === 'text_response') {
        setTextValue(existingAnswer.answer_value);
      } else {
        setSelectedValue(existingAnswer.answer_value);
      }
    }
  }, [question.id, question.question_type]);

  const handleOptionSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    saveLocalAnswer(question.id, {
      answer_value: optionValue,
      answer_type: 'option_selected',
    });
    // Auto-advance after selection
    setTimeout(() => onNext(), 300);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextValue(value);
  };

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      saveLocalAnswer(question.id, {
        answer_value: textValue.trim(),
        answer_type: 'text_entered',
      });
      onNext();
    }
  };

  const handleInfoScreenCTA = () => {
    // For info screens with CTA buttons, navigate to the specified route
    if (question.cta_button_route) {
      onNext();
    }
  };

  // Multiple Choice Question
  if (question.question_type === 'multiple_choice') {
    return (
      <div className="text-center px-2 h-full flex flex-col justify-center">
        <OnboardingHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 flex-1 flex flex-col justify-center"
        >
          <h2 className="text-2xl font-bold text-white mb-8">
            {question.question_text}
          </h2>

          <div className="space-y-3">
            {options.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleOptionSelect(option.option_value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  selectedValue === option.option_value
                    ? 'bg-[#AEE3F5] text-black shadow-[0_0_20px_rgba(174,227,245,0.4)]'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {option.option_text}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Text Response Question
  if (question.question_type === 'text_response') {
    return (
      <div className="text-center px-2 h-full flex flex-col justify-center">
        <OnboardingHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 flex-1 flex flex-col justify-center"
        >
          <h2 className="text-2xl font-bold text-white mb-8">
            {question.question_text}
          </h2>

          <Input
            type="text"
            placeholder="Type your answer..."
            value={textValue}
            onChange={handleTextChange}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 pb-16"
          >
            <Button
              onClick={handleTextSubmit}
              disabled={!textValue.trim()}
              className="w-full h-11 text-base font-medium shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black"
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Info Screen
  if (question.question_type === 'info_screen') {
    return (
      <div className="text-center px-2 h-full flex flex-col justify-center">
        <OnboardingHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 flex-1 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            {question.question_text}
          </h2>

          {question.subtext && (
            <p className="text-lg text-gray-300 mb-8">{question.subtext}</p>
          )}

          {question.cta_button_text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4 pb-16"
            >
              <Button
                onClick={handleInfoScreenCTA}
                className="w-full h-11 text-base font-medium shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] hover:scale-[1.02] transition-all duration-300 bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black"
              >
                {question.cta_button_text}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return null;
};

export default DynamicQuestionRenderer;

