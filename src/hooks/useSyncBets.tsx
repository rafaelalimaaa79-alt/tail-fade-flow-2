import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  handleSyncResponse,
  SyncResponse,
  formatSyncSuccessMessage
} from '@/utils/syncResponseHandler';
import { safeSetItem, safeGetItem, safeRemoveItem } from '@/utils/localStorage';

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

    // Check if OTP was verified within the last hour
    const otpVerifiedAt = safeGetItem('otpVerifiedAt');
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    let forceRefresh = true; // Default to true (requires 2FA)

    if (otpVerifiedAt) {
      const verifiedTime = new Date(otpVerifiedAt).getTime();
      const now = Date.now();
      const timeSinceVerification = Math.abs(now - verifiedTime); // Use abs to handle clock skew

      if (timeSinceVerification < oneHour) {
        forceRefresh = false; // Within 1 hour, skip refresh
        console.log(`OTP verified ${Math.round(timeSinceVerification / 1000 / 60)} minutes ago - skipping refresh`);
      } else {
        console.log(`OTP verification expired (${Math.round(timeSinceVerification / 1000 / 60)} minutes ago) - refresh required`);
      }
    } else {
      console.log('No OTP verification found - refresh required');
    }

    try {
      const { data, error } = await supabase.functions.invoke('sync-bets', {
        body: {
          internalId: user.id,
          userId: user.id,
          forceRefresh
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
          safeSetItem('lastSyncTime', now.toISOString());

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
  const handleModalComplete = useCallback(async () => {
    console.log('SharpSports modal completed, closing and fetching data...');
    setSharpSportsModal(null);

    // IMPORTANT: Set OTP verification timestamp
    // This allows subsequent syncs within 1 hour to skip 2FA
    const now = new Date().toISOString();
    const success = safeSetItem('otpVerifiedAt', now);

    if (!success) {
      console.error('Failed to save OTP verification - will require 2FA on next sync');
      toast.warning('2FA verified, but could not save session. You may need to verify again.');
    } else {
      console.log('OTP verified at:', now);
    }

    // Show loading state
    toast.info('2FA verified! Fetching your bets...');

    // IMPORTANT: Wait 3 seconds for SharpSports to process 2FA
    // This ensures the data is fresh and ready to fetch
    console.log('Waiting 3 seconds for SharpSports to process 2FA...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // After 2FA completion, fetch data WITHOUT triggering refresh
    // This prevents another 2FA prompt
    try {
      const { data, error } = await supabase.functions.invoke('sync-bets', {
        body: {
          internalId: user?.id,
          userId: user?.id,
          forceRefresh: false // Skip refresh, just fetch data
        }
      });

      if (error) {
        console.error('Post-2FA sync error:', error);
        toast.error('Failed to fetch bets: ' + error.message);
        setIsSyncing(false);
        return;
      }

      console.log('Post-2FA sync response:', data);

      handleSyncResponse(data as SyncResponse, {
        onSuccess: (response) => {
          const message = formatSyncSuccessMessage(response);
          toast.success(message);

          // Update last sync time
          const now = new Date();
          setLastSyncTime(now);
          safeSetItem('lastSyncTime', now.toISOString());

          // Dispatch event for other components to listen
          window.dispatchEvent(new CustomEvent('bets-synced', {
            detail: response
          }));

          console.log('Post-2FA sync completed successfully:', response);
          setIsSyncing(false);
        },

        onOtpRequired: () => {
          // This shouldn't happen since forceRefresh=false
          console.error('Unexpected OTP required after 2FA completion');
          toast.error('Unexpected error. Please try syncing again.');
          setIsSyncing(false);
        },

        onRelinkRequired: () => {
          // This shouldn't happen since forceRefresh=false
          console.error('Unexpected relink required after 2FA completion');
          toast.error('Unexpected error. Please try syncing again.');
          setIsSyncing(false);
        },

        onRateLimited: (retryAfter, message) => {
          toast.error(message);
          setIsSyncing(false);
        },

        onError: (message) => {
          toast.error(message);
          setIsSyncing(false);
        }
      });

    } catch (error) {
      console.error('Unexpected post-2FA sync error:', error);
      toast.error('Failed to fetch bets. Please try again.');
      setIsSyncing(false);
    }
  }, [user]);

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
    const stored = safeGetItem('lastSyncTime');
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

