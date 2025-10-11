import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  handleSyncResponse,
  SyncResponse,
  formatSyncSuccessMessage
} from '@/utils/syncResponseHandler';

interface SharpSportsModalState {
  url: string;
  title: string;
  message: string;
}

/**
 * Hook for syncing bets with SharpSports
 * Handles 2FA, re-linking, and all sync states
 */
export const useSyncBets = () => {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [sharpSportsModal, setSharpSportsModal] = useState<SharpSportsModalState | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  /**
   * Main sync function
   */
  const syncBets = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in to sync bets');
      return;
    }

    if (isSyncing) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    console.log('Starting bet sync for user:', user.id);
    setIsSyncing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-bets', {
        body: { 
          internalId: user.id, 
          userId: user.id 
        }
      });

      if (error) {
        console.error('Sync error:', error);
        toast.error('Sync failed: ' + error.message);
        return;
      }

      console.log('Sync response:', data);

      handleSyncResponse(data as SyncResponse, {
        onSuccess: (response) => {
          const message = formatSyncSuccessMessage(response);
          toast.success(message);

          // Update last sync time
          const now = new Date();
          setLastSyncTime(now);
          localStorage.setItem('lastSyncTime', now.toISOString());

          // Dispatch event for other components to listen
          window.dispatchEvent(new CustomEvent('bets-synced', {
            detail: response
          }));

          console.log('Sync completed successfully:', response);
          setIsSyncing(false); // Only set false on success
        },

        onOtpRequired: (otpUrl, cid, accounts) => {
          console.log('OTP required for accounts:', accounts);
          setSharpSportsModal({
            url: otpUrl,
            title: '2FA Verification Required',
            message: 'Please enter the verification code sent to your sportsbook account.'
          });
          // Keep isSyncing = true while modal is open
          // Will be set to false when modal closes
        },

        onRelinkRequired: (linkUrl, cid, accounts) => {
          console.log('Relink required for accounts:', accounts);
          setSharpSportsModal({
            url: linkUrl,
            title: 'Re-link Your Account',
            message: 'Your account verification has expired. Please re-link your sportsbook account.'
          });
          // Keep isSyncing = true while modal is open
          // Will be set to false when modal closes
        },

        onRateLimited: (retryAfter, message) => {
          console.log('Rate limited, retry after:', retryAfter);
          toast.error(message);
          setIsSyncing(false); // Set false on rate limit

          // Auto-retry after cooldown
          setTimeout(() => {
            console.log('Auto-retrying after rate limit...');
            syncBets();
          }, retryAfter * 1000);
        },

        onError: (message, status) => {
          console.error('Sync error:', status, message);
          toast.error(message);
          setIsSyncing(false); // Set false on error
        }
      });

    } catch (error) {
      console.error('Unexpected sync error:', error);
      toast.error('Sync failed. Please try again.');
      setIsSyncing(false); // Set false on exception
    }
  }, [user, isSyncing]);

  /**
   * Handle modal completion (2FA or relink completed)
   */
  const handleModalComplete = useCallback(() => {
    console.log('SharpSports modal completed, closing...');
    setSharpSportsModal(null);
    setIsSyncing(false); // Release the sync lock

    toast.success('Verification completed! You can now sync your bets manually.');
  }, []);

  /**
   * Handle modal close without completion
   */
  const handleModalClose = useCallback(() => {
    console.log('SharpSports modal closed without completion');
    setSharpSportsModal(null);
    setIsSyncing(false); // Release the sync lock
    toast.info('Sync cancelled. You can retry later from the sync button.');
  }, []);

  /**
   * Get last sync time from localStorage on mount
   */
  useEffect(() => {
    const stored = localStorage.getItem('lastSyncTime');
    if (stored) {
      setLastSyncTime(new Date(stored));
    }
  }, []);

  /**
   * Listen for auth-sync-trigger event from AuthContext
   * This handles auto-sync for biometric and other non-password logins
   */
  useEffect(() => {
    const handleAuthSyncTrigger = (event: CustomEvent) => {
      console.log('Auth sync trigger received:', event.detail);
      syncBets();
    };

    window.addEventListener('auth-sync-trigger', handleAuthSyncTrigger as EventListener);

    return () => {
      window.removeEventListener('auth-sync-trigger', handleAuthSyncTrigger as EventListener);
    };
  }, [syncBets]);

  return {
    syncBets,
    isSyncing,
    sharpSportsModal,
    handleModalComplete,
    handleModalClose,
    lastSyncTime
  };
};

