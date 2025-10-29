import { useEffect, useRef } from 'react';
import { APP_VERSION } from '@/version';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check for new app versions and notify users
 * @param checkIntervalMs - Interval in milliseconds to check for new versions (default: 60000 = 1 minute)
 */
export const useVersionCheck = (checkIntervalMs = 60000) => {
  const hasShownToastRef = useRef(false);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        console.log(`[VERSION-CHECK] Current version: ${APP_VERSION}`);

        const { data, error } = await supabase.functions.invoke('get-app-version');

        if (error) {
          console.warn(`[VERSION-CHECK] Failed to fetch version:`, error);
          return;
        }

        if (!data) {
          console.warn('[VERSION-CHECK] No data returned from version check');
          return;
        }

        const latestVersion = data.version;

        console.log(`[VERSION-CHECK] Latest version: ${latestVersion}`);

        if (latestVersion !== APP_VERSION && !hasShownToastRef.current) {
          hasShownToastRef.current = true;
          console.log(`[VERSION-CHECK] New version available: ${latestVersion}`);

          if (data.forceUpdate) {
            // Force update - show alert that can't be dismissed
            console.log('[VERSION-CHECK] Force update enabled');
            toast.error(`Update Required: ${data.releaseNotes || 'A critical update is required. Please reload the app.'}`, {
              action: {
                label: 'Reload Now',
                onClick: () => {
                  console.log('[VERSION-CHECK] User clicked reload');
                  window.location.reload();
                }
              },
              duration: Infinity
            });
          } else {
            // Optional update - show dismissible toast
            console.log('[VERSION-CHECK] Optional update available');
            toast.info(data.releaseNotes || 'A new version is available. Please reload to get the latest features.', {
              action: {
                label: 'Reload',
                onClick: () => {
                  console.log('[VERSION-CHECK] User clicked reload');
                  window.location.reload();
                }
              }
            });
          }
        }
      } catch (error) {
        console.error('[VERSION-CHECK] Failed to check version:', error);
      }
    };

    // Check immediately on mount
    checkVersion();

    // Then check periodically
    const interval = setInterval(checkVersion, checkIntervalMs);

    return () => clearInterval(interval);
  }, [checkIntervalMs]);
};

