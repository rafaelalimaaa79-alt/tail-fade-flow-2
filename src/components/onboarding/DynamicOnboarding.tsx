import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingProgress from './OnboardingProgress';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import OnboardingStep5 from './OnboardingStep5';
import OnboardingStep6 from './OnboardingStep6';
import OnboardingStep7 from './OnboardingStep7';

const DynamicOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    leagues: [] as string[],
    teams: [] as string[],
    name: '',
    experience: '',
    bankroll: '',
    sportsbooks: [] as string[],
    location: { country: '', state: '' },
    birthday: { month: '', day: '', year: '' },
    referral: [] as string[],
  });

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to did-you-know after completing onboarding
      navigate('/did-you-know');
    }
  };

  const handleSkip = () => {
    navigate('/did-you-know');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalSteps = 3;

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-8">
        <div className="w-full max-w-2xl mx-auto">
          <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

          <div className="mt-12">
            {currentStep === 1 && (
              <OnboardingStep1
                selectedLeagues={formData.leagues}
                onSelect={(leagues) => updateFormData('leagues', leagues)}
                onNext={handleNext}
              />
            )}

            {currentStep === 2 && (
              <OnboardingStep2
                selectedTeams={formData.teams}
                selectedLeague={formData.leagues[0] || 'NFL'}
                onSelect={(teams) => updateFormData('teams', teams)}
                onNext={handleNext}
              />
            )}

            {currentStep === 3 && (
              <OnboardingStep3
                name={formData.name}
                onNameChange={(name) => updateFormData('name', name)}
                onNext={handleNext}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="p-4 rounded-xl bg-gray-900 border border-white/20 text-white hover:bg-gray-800 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform rotate-180">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="mt-6 text-white/70 hover:text-white text-base underline transition-colors mx-auto block"
          >
            Skip Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicOnboarding;

