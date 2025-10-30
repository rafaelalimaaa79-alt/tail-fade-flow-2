import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState, useRef } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { isIOSWebView } from '@/utils/platform-detection';
import { postSharpSportsMessage } from '@/utils/ios-bridge';

interface SharpSportsModalProps {
  url: string | null;
  title: string;
  message?: string;
  type?: '2fa' | 'relink';
  onComplete: () => void;
  onClose?: () => void;
  forcedMode?: boolean; // New prop: makes modal full-screen and non-dismissable until completion
}

/**
 * Modal component for displaying SharpSports UI (2FA, account linking)
 * Handles iframe communication and completion detection
 */
export const SharpSportsModal = ({
  url,
  title,
  message,
  type = '2fa',
  onComplete,
  onClose,
  forcedMode = false
}: SharpSportsModalProps) => {
  const [isOpen, setIsOpen] = useState(!!url);
  const [isLoading, setIsLoading] = useState(true);
  const [canClose, setCanClose] = useState(false);
  const [showManualClose, setShowManualClose] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const [isVerified, setIsVerified] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadCountRef = useRef(0);
  const completedRef = useRef(false);

  const is2FA = type === '2fa';
  const isInIOSWebView = isIOSWebView();

  useEffect(() => {
    setIsOpen(!!url);
    if (url) {
      setIsLoading(true);
      setShowManualClose(false);
      setCountdown(40); // Reset countdown
      setIsVerified(false); // Reset verification state
      loadCountRef.current = 0; // Reset load counter for new URL
      completedRef.current = false;

      // Notify iOS app that SharpSports modal is opening
      if (isInIOSWebView) {
        console.log('📱 iOS WebView detected - SharpSports modal opening');
        postSharpSportsMessage('modal_opened', { url, type });
      }

      if (forcedMode) {
        // Forced mode (onboarding): Never allow manual close - only auto-close on completion
        setCanClose(false);
      } else if (is2FA) {
        // For 2FA: Disable close for first 10 seconds
        setCanClose(false);
        const timer = setTimeout(() => {
          setCanClose(true);
        }, 10000);
        return () => clearTimeout(timer);
      } else {
        // For relinking/onboarding: Always allow close
        setCanClose(true);
        // Note: Manual close button will be shown based on load count (>= 3)
        // not based on time, to ensure it only appears on the final blank page
      }
    }
  }, [url, is2FA, forcedMode, isInIOSWebView]);

  // Countdown timer for 2FA
  useEffect(() => {
    if (!isOpen || !is2FA || isVerified || isLoading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0; // Stop at 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, is2FA, isVerified, isLoading]);

  useEffect(() => {
    if (!isOpen) return;

    // Listen for completion from SharpSports iframe via postMessage
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== 'https://ui.sharpsports.io') {
        return;
      }

      console.log('📨 SharpSports postMessage received:', event.data);

      // Check for various completion signal formats
      const isComplete =
        event.data === 'complete' ||
        event.data === 'done' ||
        event.data === 'success' ||
        event.data === 'otp_complete' ||
        event.data === 'link_complete' ||
        (typeof event.data === 'object' && (
          event.data?.type === 'complete' ||
          event.data?.status === 'complete' ||
          event.data?.action === 'complete'
        ));

      if (isComplete) {
        console.log('✅ SharpSports flow completed via postMessage');
        triggerCompletion('postMessage');
      }
    };

    // Also check URL hash for /done redirect (backup method)
    const checkHash = () => {
      if (window.location.hash === '#done' || window.location.hash === '#complete') {
        console.log('✅ Detected completion via URL hash');
        triggerCompletion('hash');
        window.location.hash = ''; // Clear hash
      }
    };

    // Check hash immediately and on change
    checkHash();
    window.addEventListener('message', handleMessage);
    window.addEventListener('hashchange', checkHash);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('hashchange', checkHash);
    };
  }, [isOpen]);

  /**
   * Trigger completion - prevents duplicate calls from multiple detection methods
   */
  const triggerCompletion = (source: 'postMessage' | 'hash' | 'iframeLoad') => {
    if (completedRef.current) {
      console.log(`⚠️ Completion already triggered, ignoring duplicate from ${source}`);
      return;
    }

    completedRef.current = true;
    setIsVerified(true); // Show success state
    console.log(`🎉 Triggering completion from ${source}`);

    // Notify iOS app of completion
    if (isInIOSWebView) {
      postSharpSportsMessage('modal_completed', { source, type });
    }

    // Delay closing slightly to show success state
    setTimeout(() => {
      handleClose(true);
    }, 1000);
  };

  const handleClose = (completed: boolean = false) => {
    console.log('Closing SharpSports modal, completed:', completed);
    setIsOpen(false);
    setIsLoading(true);

    // Notify iOS app of modal closing
    if (isInIOSWebView) {
      postSharpSportsMessage('modal_closed', { completed, type });
    }

    if (completed) {
      onComplete();
    } else {
      onClose?.();
    }
  };

  const handleIframeLoad = () => {
    loadCountRef.current += 1;
    const loadCount = loadCountRef.current;

    console.log(`📄 SharpSports iframe loaded (count: ${loadCount})`);
    setIsLoading(false);

    // For relinking/onboarding: Detect blank page (final page after successful linking)
    if (!is2FA && loadCount >= 2) {
      console.log('✅ Final blank page reached - linking successful!');
      setShowManualClose(true);
      setIsVerified(true); // Show success state

      // Auto-close after 2 seconds to show success message
      setTimeout(() => {
        console.log('Auto-closing modal after relinking completion');
        triggerCompletion('iframeLoad');
      }, 2000);
      return;
    }

    // Auto-detection only for 2FA
    if (!is2FA) {
      console.log('Relinking modal - waiting for manual completion');
      return;
    }

    if (loadCount === 1) {
      console.log('Initial OTP page loaded');
      return;
    }

    if (is2FA && loadCount >= 2) {
      console.log('✅ Iframe navigated to new page - likely /done (2FA completed)');
      // Wait a moment to ensure the page is fully loaded, then trigger completion
      setTimeout(() => {
        console.log('Auto-closing modal after 2FA completion (iframe load detection)');
        triggerCompletion('iframeLoad');
      }, 500);
    }
  };

  if (!url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Forced mode: Never allow manual close
      if (forcedMode) {
        return;
      }
      // For 2FA: Only allow closing if canClose is true (after 10 seconds)
      // For relinking: Always allow closing
      if (!open && canClose) {
        handleClose(false);
      }
    }}>
      <DialogContent
        className={forcedMode
          ? "w-screen h-screen max-w-none p-0 bg-background flex flex-col gap-0 rounded-none overflow-hidden"
          : "max-w-lg h-[90vh] max-h-[700px] p-0 bg-background flex flex-col gap-0 overflow-hidden"
        }
        hideCloseButton={forcedMode}
      >
        <DialogHeader className="p-4 pb-2 border-b border-white/10 flex-shrink-0">
          {!is2FA && <DialogTitle className="text-white">{title}</DialogTitle>}
          {!is2FA && message && (
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          )}
          {is2FA && !isLoading && (
            <div className="mt-3 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Circular progress ring */}
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-white/10"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className={isVerified ? "text-green-500" : "text-[#AEE3F5]"}
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - countdown / 40)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isVerified ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  ) : (
                    <span className="text-2xl font-bold text-[#AEE3F5]">
                      {countdown}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                {isVerified ? (
                  <p className="text-sm font-medium text-green-500">
                    ✓ Verified! Fetching bets...
                  </p>
                ) : countdown > 25 ? (
                  <p className="text-sm font-medium text-[#AEE3F5]">
                    2FA Verification Required
                  </p>
                ) : countdown > 10 ? (
                  <p className="text-sm font-medium text-[#AEE3F5]">
                    ⏳ Verifying code...
                  </p>
                ) : countdown > 0 ? (
                  <p className="text-sm font-medium text-yellow-400 animate-pulse">
                    ⏳ Fetching your bets...
                  </p>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Taking longer than usual...
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      Please be patient
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogHeader>
        
        <div className="flex-1 relative min-h-0 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            title={title}
            onLoad={handleIframeLoad}
            sandbox={
              isInIOSWebView
                ? "allow-same-origin allow-scripts allow-forms allow-popups"
                : "allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            }
            allow="clipboard-write"
          />
        </div>

        <div className="p-4 border-t border-white/10 flex-shrink-0">
          {is2FA ? (
            // 2FA: No message needed
            null
          ) : (
            // Relinking: Show success message or manual close button
            isVerified ? (
              <div className="flex flex-col gap-2 items-center">
                <p className="text-sm font-medium text-green-500">
                  ✓ Linking successful! Closing...
                </p>
              </div>
            ) : showManualClose ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground text-center">
                  Completed the verification?
                </p>
                <button
                  onClick={() => handleClose(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-colors"
                >
                  I'm Done - Continue
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center">
                Complete the process above, then this window will close automatically
              </p>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

