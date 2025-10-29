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
  type: '2fa' | 'relink';
  forcedMode?: boolean; // New: makes modal full-screen and non-dismissable
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
   * @param overrideUserId - Optional user ID to use instead of the current user (for sign-in race conditions)
   * @param forcedMode - If true, makes 2FA modal full-screen and non-dismissable (for onboarding)
   */
  const syncBets = useCallback(async (overrideUserId?: string, forcedMode: boolean = false) => {
    const userId = overrideUserId || user?.id;

    if (!userId) {
      toast.error('Please sign in to sync bets');
      return;
    }

    if (isSyncing) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    console.log('Starting bet sync for user:', userId);
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
          internalId: userId,
          userId: userId,
          forceRefresh
        }
      });

      if (error) {
        const errorMessage = data?.error || data?.message || data?.detail || error.message;
        console.error('Sync error:', error, 'Response data:', data);
        toast.error('Sync failed: ' + errorMessage);
        setIsSyncing(false); // Reset loading state on error
        return;
      }

      if (data.statusCode !== 200) {
        console.error('Sync failed with status code:', data.statusCode, 'Response data:', data);
        toast.error('Sync failed: ' + data.message);
        setIsSyncing(false);
        if (data.statusCode != 401) {
          return;
        }
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
            message: 'Please enter the verification code sent to your sportsbook account.',
            type: '2fa',
            forcedMode // Pass forcedMode to modal
          });
          // Keep isSyncing = true while modal is open
          // Will be set to false when modal closes
        },

        onRelinkRequired: (linkUrl, cid, accounts) => {
          console.log('Relink required for accounts:', accounts);
          setSharpSportsModal({
            url: linkUrl,
            title: 'Re-link Your Account',
            message: 'Your account verification has expired. Please re-link your sportsbook account.',
            type: 'relink',
            forcedMode // Pass forcedMode to modal
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
    const modalType = sharpSportsModal?.type;
    console.log(`SharpSports modal completed (${modalType}), closing...`);
    setSharpSportsModal(null);

    if (modalType === '2fa') {
      // 2FA COMPLETION: Set timestamp, wait, and fetch data

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
        // Extract the real error message from the response body
        // When edge function returns non-2xx status, the actual error details are in 'data', not 'error.message'
        const errorMessage = data?.error || data?.message || data?.detail || error.message;
        console.error('Post-2FA sync error:', error, 'Response data:', data);
        toast.error('Failed to fetch bets: ' + errorMessage);
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

    } else if (modalType === 'relink') {
      // RELINKING COMPLETION: Trigger refresh to fetch fresh data from re-linked account
      console.log('Account re-linked successfully, triggering refresh...');
      toast.info('Account re-linked! Fetching your bets...');

      // Wait a moment for SharpSports to process the linking
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Trigger sync with forceRefresh to scrape the newly re-linked account
      try {
        const { data, error } = await supabase.functions.invoke('sync-bets', {
          body: {
            internalId: user?.id,
            userId: user?.id,
            forceRefresh: true // MUST be true to trigger SharpSports to scrape the re-linked account
          }
        });

        if (error) {
          console.error('Post-relink sync error:', error);
          toast.error('Failed to sync bets. Please try again.');
          setIsSyncing(false);
          return;
        }

        // Handle response using existing handler
        handleSyncResponse(data, {
          onSuccess: (data) => {
            toast.success(formatSyncSuccessMessage(data));
            setIsSyncing(false);
          },

          onOtpRequired: () => {
            // This shouldn't happen after relinking
            console.error('Unexpected OTP required after relinking');
            toast.error('Unexpected error. Please try syncing again.');
            setIsSyncing(false);
          },

          onRelinkRequired: () => {
            // This shouldn't happen after relinking
            console.error('Unexpected relink required after relinking');
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
        console.error('Unexpected post-relink sync error:', error);
        toast.error('Failed to fetch bets. Please try again.');
        setIsSyncing(false);
      }
    }
  }, [user, sharpSportsModal]);

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

  return {
    syncBets,
    isSyncing,
    sharpSportsModal,
    handleModalComplete,
    handleModalClose,
    lastSyncTime
  };
};

