import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setIsOpen(!!url);
    if (url) {
      setIsLoading(true);
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
    console.log('SharpSports iframe loaded');
    setIsLoading(false);
  };

  if (!url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose(false)}>
      <DialogContent className="max-w-lg h-[600px] p-0 bg-background">
        <DialogHeader className="p-4 pb-2 border-b border-white/10">
          <DialogTitle className="text-white">{title}</DialogTitle>
          {message && (
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
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
            src={url}
            className="w-full h-full border-0"
            title={title}
            onLoad={handleIframeLoad}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="clipboard-write"
          />
        </div>
        
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-xs text-muted-foreground">
            Complete the process above, then this window will close automatically
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

