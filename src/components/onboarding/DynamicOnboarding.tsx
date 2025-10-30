import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import OnboardingProgress from './OnboardingProgress';
import DynamicQuestionRenderer from './DynamicQuestionRenderer';
import DynamicOnboardingStep23 from './DynamicOnboardingStep23';
import DynamicOnboardingStep24 from './DynamicOnboardingStep24';
import OnboardingTfaModal from './OnboardingTfaModal';
import OnboardingEnterCodeButton from './OnboardingEnterCodeButton';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import {
  fetchOnboardingQuestions,
  fetchOnboardingOptions,
  OnboardingQuestion,
  OnboardingOption,
} from '@/services/dynamicOnboardingService';
import { toast } from 'sonner';

const DynamicOnboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [options, setOptions] = useState<OnboardingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get initial step from URL or default to 1
  const initialStep = parseInt(searchParams.get('step') || '1', 10);
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Load questions and options on mount
  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        setIsLoading(true);
        const [questionsData, optionsData] = await Promise.all([
          fetchOnboardingQuestions(),
          fetchOnboardingOptions(),
        ]);
        setQuestions(questionsData);
        setOptions(optionsData);
        setError(null);
      } catch (err) {
        console.error('Error loading onboarding data:', err);
        setError('Failed to load onboarding questions. Please try again.');
        toast.error('Failed to load onboarding questions');
      } finally {
        setIsLoading(false);
      }
    };

    loadOnboardingData();
  }, []);

  // Warn user before leaving during onboarding
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep < 23) {
        e.preventDefault();
        e.returnValue = 'Are you sure? Your progress is not saved.';
        return 'Are you sure? Your progress is not saved.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep]);

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 24) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#AEE3F5]" />
          <p className="text-white">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <p className="text-red-500 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const totalSteps = 24;
  const currentQuestion = questions.find(q => q.step_number === currentStep);

  return (
    <OnboardingProvider>
      <OnboardingEnterCodeButton />
      <div className="bg-black min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-md">
            <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

            <div className="mt-8">
              {currentStep < 23 && currentQuestion && (
                <DynamicQuestionRenderer
                  question={currentQuestion}
                  options={options.filter(o => o.question_id === currentQuestion.id)}
                  onNext={handleNext}
                />
              )}

              {currentStep === 23 && (
                <DynamicOnboardingStep23 onNext={handleNext} />
              )}

              {currentStep === 24 && (
                <DynamicOnboardingStep24 />
              )}
            </div>

            {/* Back button for steps 2-23 */}
            {currentStep > 1 && currentStep < 24 && (
              <div className="mt-8 flex gap-4">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
              </div>
            )}
          </div>
        </div>

        <OnboardingTfaModal />
      </div>
    </OnboardingProvider>
  );
};

export default DynamicOnboarding;

