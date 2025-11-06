import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from '@/constants/stripe';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  clientSecret: string;
  sessionId: string;
  onClose: () => void;
  onSuccess: () => void;
  plan: string;
}

const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  clientSecret,
  sessionId,
  onClose,
  onSuccess,
  plan
}) => {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.error('Stripe publishable key not configured');
      toast.error('Payment system not configured');
      return;
    }

    // Load Stripe
    const stripe = loadStripe(STRIPE_PUBLISHABLE_KEY);
    setStripePromise(stripe);
    setIsLoading(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0F172A] rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-xl font-bold">Complete Your Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading || !stripePromise ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#AEE3F5] mx-auto mb-3" />
                <p className="text-gray-400">Loading checkout...</p>
              </div>
            </div>
          ) : (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                clientSecret,
                onComplete: async () => {
                  console.log('✅ Payment completed - verifying with server...');
                  setIsVerifying(true);
                  
                  try {
                    // Verify payment with backend
                    const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
                      body: { sessionId }
                    });

                    if (error || !data?.verified) {
                      console.error('Payment verification failed:', error || data);
                      toast.error('Payment verification failed. Please contact support if you were charged.');
                      setIsVerifying(false);
                      return;
                    }

                    console.log('✅ Payment verified successfully');
                    toast.success('Payment successful! Welcome to NoShot Premium.');
                    setIsVerifying(false);
                    onSuccess();
                  } catch (error) {
                    console.error('Error verifying payment:', error);
                    toast.error('Error verifying payment. Please contact support if you were charged.');
                    setIsVerifying(false);
                  }
                }
              }}
            >
              {isVerifying ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#AEE3F5] mx-auto mb-3" />
                    <p className="text-gray-400">Verifying payment...</p>
                  </div>
                </div>
              ) : (
                <EmbeddedCheckout />
              )}
            </EmbeddedCheckoutProvider>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6 bg-white/5">
          <p className="text-gray-400 text-xs text-center">
            Your subscription will renew automatically. You can cancel anytime in your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckoutModal;

