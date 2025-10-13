import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface SharpSportsModalProps {
  url: string | null;
  title: string;
  message?: string;
  type?: '2fa' | 'relink';
  onComplete: () => void;
  onClose?: () => void;
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
  onClose
}: SharpSportsModalProps) => {
  const [isOpen, setIsOpen] = useState(!!url);
  const [isLoading, setIsLoading] = useState(true);
  const [canClose, setCanClose] = useState(false);
  const [showManualClose, setShowManualClose] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadCountRef = useRef(0);
  const completedRef = useRef(false);

  const is2FA = type === '2fa';

  useEffect(() => {
    setIsOpen(!!url);
    if (url) {
      setIsLoading(true);
      setShowManualClose(false);
      loadCountRef.current = 0; // Reset load counter for new URL
      completedRef.current = false;

      if (is2FA) {
        // For 2FA: Disable close for first 10 seconds
        setCanClose(false);
        const timer = setTimeout(() => {
          setCanClose(true);
        }, 10000);
        return () => clearTimeout(timer);
      } else {
        // For relinking: Always allow close
        setCanClose(true);
        // Show manual close button after 15 seconds for relinking
        const timer = setTimeout(() => {
          setShowManualClose(true);
        }, 15000);
        return () => clearTimeout(timer);
      }
    }
  }, [url, is2FA]);

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
    console.log(`🎉 Triggering completion from ${source}`);
    handleClose(true);
  };

  const handleClose = (completed: boolean = false) => {
    console.log('Closing SharpSports modal, completed:', completed);
    setIsOpen(false);
    setIsLoading(true);

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

    // Auto-detection only for 2FA
    if (!is2FA) {
      console.log('Relinking modal - no auto-detection via iframe load');
      return;
    }

    if (loadCount === 1) {
      console.log('Initial OTP page loaded');
      return;
    }

    if (loadCount >= 2) {
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
      // For 2FA: Only allow closing if canClose is true (after 10 seconds)
      // For relinking: Always allow closing
      if (!open && canClose) {
        handleClose(false);
      }
    }}>
      <DialogContent className="max-w-lg h-[600px] p-0 bg-background flex flex-col gap-0">
        <DialogHeader className="p-4 pb-2 border-b border-white/10">
          <DialogTitle className="text-white">{title}</DialogTitle>
          {message && (
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          )}
          {is2FA && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-yellow-400 font-medium flex items-center gap-2">
                <span className="text-lg">⏳</span>
                Please wait - the modal will close automatically after verification succeeds.
              </p>
              <p className="text-xs text-gray-400">
                Do not close this window manually.
              </p>
            </div>
          )}
        </DialogHeader>
        
        <div className="flex-1 relative">
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
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="clipboard-write"
          />
        </div>

        <div className="p-4 border-t border-white/10">
          {is2FA ? (
            // 2FA: Show waiting indicator
            !isLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                <span>Waiting for verification...</span>
              </div>
            )
          ) : (
            // Relinking: Show manual close button or instruction
            showManualClose ? (
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

