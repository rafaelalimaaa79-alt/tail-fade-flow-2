import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import OnboardingHeader from './OnboardingHeader';

const DynamicOnboardingStep24: React.FC = () => {
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate('/did-you-know');
  };

  const handleSubscribe = () => {
    // TODO: Implement subscription logic
    navigate('/did-you-know');
  };

  return (
    <div className="text-center px-2 h-full flex flex-col justify-center">
      <OnboardingHeader />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 flex-1 flex flex-col justify-center"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Unlock Premium Features
          </h2>
          <p className="text-lg text-gray-300">
            Get access to advanced analytics, real-time alerts, and exclusive insights.
          </p>
        </div>

        <div className="space-y-3 text-left bg-gray-900 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-[#AEE3F5] font-bold">✓</span>
            <p className="text-white">Real-time fade tracking</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#AEE3F5] font-bold">✓</span>
            <p className="text-white">Advanced bettor analytics</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#AEE3F5] font-bold">✓</span>
            <p className="text-white">Exclusive community access</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#AEE3F5] font-bold">✓</span>
            <p className="text-white">Priority support</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 pt-4 pb-16"
        >
          <Button
            onClick={handleSubscribe}
            className="w-full h-11 text-base font-medium shadow-[0_0_20px_rgba(174,227,245,0.4)] hover:shadow-[0_0_30px_rgba(174,227,245,0.6)] hover:scale-[1.02] transition-all duration-300 bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black"
          >
            Subscribe Now
          </Button>

          <Button
            onClick={handleSkip}
            variant="outline"
            className="w-full h-11 text-base font-medium"
          >
            Skip for Now
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DynamicOnboardingStep24;

