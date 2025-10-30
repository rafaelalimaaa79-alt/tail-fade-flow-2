import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import OnboardingStep5 from './OnboardingStep5';
import OnboardingStep6 from './OnboardingStep6';
import OnboardingStep7 from './OnboardingStep7';
import OnboardingStep8 from './OnboardingStep8';
import OnboardingStep9 from './OnboardingStep9';

const DynamicOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    leagues: [] as string[],
    teams: [] as string[],
    name: '',
    experience: '',
    bankroll: '',
    quizAnswer: '',
    sportsbooks: [] as string[],
    country: '',
    state: '',
    birthday: { month: '', day: '', year: '' },
    referralSources: [] as string[],
  });

  const totalSteps = 7;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            value={formData.leagues}
            onSelect={(leagues) => updateFormData('leagues', leagues)}
          />
        );
      case 2:
        return (
          <OnboardingStep8
            value={formData.birthday}
            onSelect={(birthday) => updateFormData('birthday', birthday)}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            value={formData.name}
            onSelect={(name) => updateFormData('name', name)}
          />
        );
      case 4:
        return (
          <OnboardingStep4
            value={formData.experience}
            onSelect={(experience) => updateFormData('experience', experience)}
          />
        );
      case 5:
        return (
          <OnboardingStep5
            value={formData.bankroll}
            onSelect={(bankroll) => updateFormData('bankroll', bankroll)}
          />
        );
      case 6:
        return (
          <OnboardingStep6
            value={formData.quizAnswer}
            onSelect={(answer) => updateFormData('quizAnswer', answer)}
          />
        );
      case 7:
        return (
          <div className="relative">
            <OnboardingStep7
              value={formData.sportsbooks}
              onSelect={(sportsbooks) => {
                updateFormData('sportsbooks', sportsbooks);
                handleNext();
              }}
              onBack={handlePrevious}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-black min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="pt-4 px-4">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index < currentStep
                  ? 'bg-white'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between px-4 py-8">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-lg">
            {renderStep()}
          </div>
        </div>

        {/* Bottom navigation */}
        {currentStep !== 7 && (
          <div className="space-y-4">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </Button>
              )}
              
              {!(currentStep === 5 && !formData.bankroll) && !(currentStep === 6 && !formData.quizAnswer) && (
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="flex-1 h-16 rounded-xl bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-semibold text-lg"
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicOnboarding;
