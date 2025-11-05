import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  saveReferralSource,
  saveLeagues,
  saveBirthday,
  saveName,
  saveExperience,
  saveBankroll,
  saveQuizAnswer,
  saveSportsbooks,
  saveSubscriptionPlan,
  completeOnboarding
} from '@/services/onboardingService';
import OnboardingStepReferral from './OnboardingStepReferral';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import OnboardingStep5 from './OnboardingStep5';
import OnboardingStep6 from './OnboardingStep6';
import OnboardingStep7 from './OnboardingStep7';
import OnboardingStep8 from './OnboardingStep8';
import OnboardingStep9 from './OnboardingStep9';
import OnboardingStepPaywall from './OnboardingStepPaywall';
import ConnectSportsbooks from '@/pages/ConnectSportsbooks';

const DynamicOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    referralSource: '',
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
    subscriptionPlan: '' as 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual' | '',
  });

  const totalSteps = 10;

  const saveCurrentStepAnswer = async () => {
    if (!user?.id) return;

    try {
      switch (currentStep) {
        case 1:
          if (formData.referralSource) {
            await saveReferralSource(user.id, formData.referralSource);
          }
          break;
        case 2:
          if (formData.leagues.length > 0) {
            await saveLeagues(user.id, formData.leagues);
          }
          break;
        case 3:
          if (formData.birthday.month && formData.birthday.day && formData.birthday.year) {
            await saveBirthday(user.id, formData.birthday);
          }
          break;
        case 4:
          if (formData.name) {
            await saveName(user.id, formData.name);
          }
          break;
        case 5:
          if (formData.experience) {
            await saveExperience(user.id, formData.experience);
          }
          break;
        case 6:
          if (formData.bankroll) {
            await saveBankroll(user.id, formData.bankroll);
          }
          break;
        case 7:
          if (formData.quizAnswer) {
            await saveQuizAnswer(user.id, formData.quizAnswer);
          }
          break;
        case 8:
          if (formData.subscriptionPlan) {
            await saveSubscriptionPlan(user.id, formData.subscriptionPlan);
          }
          break;
        case 10:
          if (formData.sportsbooks.length > 0) {
            await saveSportsbooks(user.id, formData.sportsbooks);
          }
          break;
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      // Save current step's answer before moving to next
      await saveCurrentStepAnswer();

      // For no_sportsbook users, skip steps 9 and 10 (ConnectSportsbooks and Sportsbook Selection)
      if (currentStep === 8 && formData.subscriptionPlan === 'monthly_no_sportsbook') {
        // Complete onboarding directly
        if (user?.id) {
          await completeOnboarding(user.id);
        }
        toast.success('Onboarding completed!');
        navigate('/dashboard');
        return;
      }

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding
        if (user?.id) {
          await completeOnboarding(user.id);
        }
        toast.success('Onboarding completed!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to save answer. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
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
          <OnboardingStepReferral
            value={formData.referralSource}
            onSelect={(source) => updateFormData('referralSource', source)}
          />
        );
      case 2:
        return (
          <OnboardingStep1
            value={formData.leagues}
            onSelect={(leagues) => updateFormData('leagues', leagues)}
          />
        );
      case 3:
        return (
          <OnboardingStep8
            value={formData.birthday}
            onSelect={(birthday) => updateFormData('birthday', birthday)}
          />
        );
      case 4:
        return (
          <OnboardingStep3
            value={formData.name}
            onSelect={(name) => updateFormData('name', name)}
          />
        );
      case 5:
        return (
          <OnboardingStep4
            value={formData.experience}
            onSelect={(experience) => updateFormData('experience', experience)}
          />
        );
      case 6:
        return (
          <OnboardingStep5
            value={formData.bankroll}
            onSelect={(bankroll) => updateFormData('bankroll', bankroll)}
          />
        );
      case 7:
        return (
          <OnboardingStep6
            value={formData.quizAnswer}
            onSelect={(answer) => updateFormData('quizAnswer', answer)}
          />
        );
      case 8:
        return (
          <OnboardingStepPaywall
            onSelect={(plan) => {
              updateFormData('subscriptionPlan', plan);
              handleNext();
            }}
          />
        );
      case 9:
        return (
          <div className="relative">
            <ConnectSportsbooks onContinue={handleNext} />
          </div>
        );
      case 10:
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
          {/* Calculate the correct number of steps to display */}
          {Array.from({
            length: formData.subscriptionPlan === 'monthly_no_sportsbook' ? 9 : totalSteps
          }).map((_, index) => (
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
        {currentStep !== 8 && currentStep !== 9 && currentStep !== 10 && (
          <div className="space-y-4">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  size="lg"
                  disabled={loading}
                  className="w-16 h-16 rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </Button>
              )}

              {((currentStep === 1 && formData.referralSource) ||
                (currentStep === 2 && formData.leagues.length > 0) ||
                (currentStep === 3 && formData.birthday.month && formData.birthday.day && formData.birthday.year) ||
                (currentStep === 4 && formData.name) ||
                (currentStep === 5 && formData.experience) ||
                (currentStep === 6 && formData.bankroll) ||
                (currentStep === 7 && formData.quizAnswer)) && (
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  size="lg"
                  className="flex-1 h-16 rounded-xl bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-semibold text-lg animate-scale-in shadow-[0_0_20px_rgba(174,227,245,0.5)] hover:shadow-[0_0_30px_rgba(174,227,245,0.7)] transition-all"
                >
                  {loading ? 'Saving...' : 'Continue'}
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
