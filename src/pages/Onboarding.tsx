
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";
import OnboardingStep4 from "@/components/onboarding/OnboardingStep4";
import OnboardingStep5 from "@/components/onboarding/OnboardingStep5";
import OnboardingStep6 from "@/components/onboarding/OnboardingStep6";
import OnboardingStep7 from "@/components/onboarding/OnboardingStep7";
import OnboardingTfaModal from "@/components/onboarding/OnboardingTfaModal";
import OnboardingEnterCodeButton from "@/components/onboarding/OnboardingEnterCodeButton";

interface OnboardingData {
  averageBet: string;
  bettingFrequency: string;
  fadedBuddy: string;
  accountBalance: string;
  throwingBombs: string;
  favoriteSport: string;
  username: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    averageBet: "",
    bettingFrequency: "",
    fadedBuddy: "",
    accountBalance: "",
    throwingBombs: "",
    favoriteSport: "",
    username: ""
  });
  const totalSteps = 7;
  const navigate = useNavigate();

  const handleStepSelect = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-advance to next step after selection (except for step 7)
    if (currentStep < totalSteps) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300); // Small delay for better UX
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetStarted = () => {
    navigate('/');
  };

  const handleComplete = (route: string) => {
    // Store the complete onboarding data
    localStorage.setItem('onboardingData', JSON.stringify(formData));
    navigate(route);
  };
  
  return (
    <OnboardingProvider>
      <OnboardingEnterCodeButton />
      <div className="bg-black min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-md">
            <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
            
            <div className="mt-8">
              {currentStep === 1 && (
                <OnboardingStep1 
                  value={formData.averageBet}
                  onSelect={(value) => handleStepSelect('averageBet', value)}
                />
              )}
              {currentStep === 2 && (
                <OnboardingStep2 
                  value={formData.bettingFrequency}
                  onSelect={(value) => handleStepSelect('bettingFrequency', value)}
                />
              )}
              {currentStep === 3 && (
                <OnboardingStep3 
                  value={formData.fadedBuddy}
                  onSelect={(value) => handleStepSelect('fadedBuddy', value)}
                />
              )}
              {currentStep === 4 && (
                <OnboardingStep4 
                  value={formData.accountBalance}
                  onSelect={(value) => handleStepSelect('accountBalance', value)}
                />
              )}
              {currentStep === 5 && (
                <OnboardingStep5 
                  value={formData.throwingBombs}
                  onSelect={(value) => handleStepSelect('throwingBombs', value)}
                />
              )}
              {currentStep === 6 && (
                <OnboardingStep6 
                  value={formData.favoriteSport}
                  onSelect={(value) => handleStepSelect('favoriteSport', value)}
                />
              )}
              {currentStep === 7 && (
                <OnboardingStep7 onComplete={handleComplete} />
              )}
            </div>
            
            {/* Only show back button for steps 2-6 */}
            {currentStep > 1 && currentStep < 7 && (
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

export default Onboarding;
