// iOS WebKit message handler utilities
export const postAuthSuccessMessage = (data: {
  userId?: string;
  email?: string;
  event: 'signin' | 'signup' | 'session_restored' | 'biometric_auth';
}) => {
  try {
    if (window.webkit?.messageHandlers?.authHandler) {
      window.webkit.messageHandlers.authHandler.postMessage(data);
      console.log('Posted auth success message to iOS:', data);
    }
  } catch (error) {
    console.log('iOS bridge not available or failed:', error);
  }
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        authHandler?: {
          postMessage: (data: any) => void;
        };
      };
    };
  }
}