import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface SharpSportsModalProps {
  url: string | null;
  title: string;
  message?: string;
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
  onComplete,
  onClose
}: SharpSportsModalProps) => {
  const [isOpen, setIsOpen] = useState(!!url);
  const [isLoading, setIsLoading] = useState(true);
  const [canClose, setCanClose] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadCountRef = useRef(0);

  useEffect(() => {
    setIsOpen(!!url);
    if (url) {
      setIsLoading(true);
      setCanClose(false); // Disable close for first 10 seconds
      loadCountRef.current = 0; // Reset load counter for new URL

      // Enable close button after 10 seconds to prevent accidental early closure
      const timer = setTimeout(() => {
        setCanClose(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [url]);

  useEffect(() => {
    if (!isOpen) return;

    // Listen for completion from SharpSports iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== 'https://ui.sharpsports.io') {
        return;
      }

      console.log('SharpSports message received:', event.data);

      // Check for completion signals
      if (
        event.data === 'complete' ||
        event.data === 'done' ||
        event.data === 'success' ||
        (typeof event.data === 'object' && event.data?.type === 'complete')
      ) {
        console.log('SharpSports flow completed');
        handleClose(true);
      }
    };

    // Also check URL hash for /done redirect
    const checkHash = () => {
      if (window.location.hash === '#done' || window.location.hash === '#complete') {
        console.log('Detected completion via hash');
        handleClose(true);
        window.location.hash = ''; // Clear hash
      }
    };

    // Note: Manual close button removed - users should wait for auto-close

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

    console.log(`SharpSports iframe loaded (count: ${loadCount})`);
    setIsLoading(false);

    if (loadCount === 1) {
      console.log('Initial OTP page loaded');
      return;
    }

    if (loadCount >= 2) {
      console.log('Iframe navigated to new page - likely /done (2FA completed)');
      // Wait a moment to ensure the page is fully loaded, then close
      setTimeout(() => {
        console.log('Auto-closing modal after 2FA completion');
        handleClose(true);
      }, 500);
    }
  };

  if (!url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Only allow closing if canClose is true (after 10 seconds)
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
          <div className="mt-3 space-y-2">
            <p className="text-sm text-yellow-400 font-medium flex items-center gap-2">
              <span className="text-lg">⏳</span>
              Please wait - the modal will close automatically after verification succeeds.
            </p>
            <p className="text-xs text-gray-400">
              Do not close this window manually.
            </p>
          </div>
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
          {!isLoading && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
              <span>Waiting for verification...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

