import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import FullscreenNotification from '@/components/FullscreenNotification';
import OnboardingHeader from './OnboardingHeader';
import UsernameInput from './UsernameInput';
import UsernamePreview from './UsernamePreview';
import { validateUsername, checkUsernameAvailability } from '@/utils/usernameValidation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { saveAnswersToDatabase, saveLocalAnswer } from '@/services/dynamicOnboardingService';
import { toast } from 'sonner';

interface DynamicOnboardingStep23Props {
  onNext: () => void;
}

const DynamicOnboardingStep23: React.FC<DynamicOnboardingStep23Props> = ({ onNext }) => {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [hasPendingTFA, setHasPendingTFA] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { setOnboardingCompleted } = useAuth();

  useEffect(() => {
    const checkPendingTFA = () => {
      const pendingTFA = localStorage.getItem('pendingTFA');
      setHasPendingTFA(!!pendingTFA);
    };

    checkPendingTFA();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pendingTFA') {
        checkPendingTFA();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(checkPendingTFA, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    const validationError = validateUsername(value);
    setError(validationError);

    if (!validationError && value.length > 8) {
      setIsChecking(true);
      const available = await checkUsernameAvailability(value);
      setIsAvailable(available);
      setIsChecking(false);
    } else {
      setIsAvailable(null);
      setIsChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (hasPendingTFA) {
      const pendingTFAData = localStorage.getItem('pendingTFA');
      let sportsbookName = 'your sportsbook';

      if (pendingTFAData) {
        try {
          const tfaData = JSON.parse(pendingTFAData);
          sportsbookName = tfaData.sportsbookName || 'your sportsbook';
        } catch (error) {
          console.error('Error parsing pendingTFA data:', error);
        }
      }

      setError(
        `Please enter the verification code that ${sportsbookName} texted to you. Use the 'Enter Code' button above to continue.`
      );
      return;
    }

    if (!username.trim()) {
      setError('You gotta pick a name to enter the Zone.');
      return;
    }

    if (!isAvailable) {
      setError('Please choose an available username');
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('No authenticated user found');
        toast.error('Not authenticated. Please sign in again.');
        setIsSaving(false);
        return;
      }

      console.log('Saving username and onboarding data:', username);

      // Save username answer to local storage
      // Note: We don't have a question_id for username in the dynamic questions
      // So we'll save it separately and handle it in the database save

      // Save all answers to database
      await saveAnswersToDatabase(user.id);

      // Update user profile with username and mark onboarding as completed
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(
          {
            id: user.id,
            username: username,
            onboarding_completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        );

      if (upsertError) {
        console.error('Error saving username to database:', upsertError);
        toast.error('Failed to save username. Please try again.');
        setIsSaving(false);
        return;
      }

      console.log('Username and onboarding data saved successfully');

      // Update AuthContext to mark onboarding as completed
      setOnboardingCompleted(true);

      // Show notification
      setShowNotification(true);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to save username. Please try again.');
      setIsSaving(false);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    onNext();
  };

  return (
    <>
      <div className="text-center px-2 h-full flex flex-col justify-center">
        <OnboardingHeader />

        <div className="space-y-4 flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-8">Create your username</h2>

          <UsernameInput
            username={username}
            isChecking={isChecking}
            isAvailable={isAvailable}
            error={error}
            onUsernameChange={handleUsernameChange}
          />

          <UsernamePreview username={username} isAvailable={isAvailable} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="pt-4 pb-16"
          >
            <Button
              onClick={handleSubmit}
              disabled={!username || !isAvailable || isChecking || hasPendingTFA || isSaving}
              className={`w-full h-11 text-base font-medium shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 ${
                hasPendingTFA
                  ? 'bg-gray-600 hover:bg-gray-600 text-gray-300'
                  : 'bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black'
              }`}
            >
              {isSaving ? 'Saving...' : hasPendingTFA ? 'Enter Verification Code' : 'Lock In Username'}
            </Button>
          </motion.div>
        </div>
      </div>

      <FullscreenNotification
        isOpen={showNotification}
        message={`YOU'RE IN! Welcome @${username}!`}
        variant="tail"
        onClose={handleNotificationClose}
        bettorName={username}
        betDescription="the FadeZone!"
        autoCloseAfter={4000}
      />
    </>
  );
};

export default DynamicOnboardingStep23;

