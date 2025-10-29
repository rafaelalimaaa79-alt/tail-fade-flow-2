/**
 * iOS WebKit Message Handler Utilities
 * Provides communication bridge between web app and iOS native wrapper
 */

/**
 * Post authentication success message to iOS app
 * @param data - Auth data containing user and type
 */
export const postAuthSuccessMessage = (data: { user: any; type: string }) => {
  try {
    if (window.webkit?.messageHandlers?.authHandler) {
      window.webkit.messageHandlers.authHandler.postMessage(data);
      console.log("📱 Posted auth success message to iOS:", data);
    }
  } catch (error) {
    console.log("iOS bridge not available or failed:", error);
  }
};

/**
 * Post navigation event to iOS app
 * @param event - Navigation event type
 * @param data - Event data
 */
export const postNavigationMessage = (event: string, data: any) => {
  try {
    if (window.webkit?.messageHandlers?.navigationHandler) {
      window.webkit.messageHandlers.navigationHandler.postMessage({
        event,
        data,
        timestamp: Date.now()
      });
      console.log("📱 Posted navigation message to iOS:", event, data);
    }
  } catch (error) {
    console.log("iOS navigation bridge not available:", error);
  }
};

/**
 * Post SharpSports event to iOS app
 * @param event - SharpSports event type
 * @param data - Event data
 */
export const postSharpSportsMessage = (event: string, data: any) => {
  try {
    if (window.webkit?.messageHandlers?.sharpsportHandler) {
      window.webkit.messageHandlers.sharpsportHandler.postMessage({
        event,
        data,
        timestamp: Date.now()
      });
      console.log("📱 Posted SharpSports message to iOS:", event, data);
    }
  } catch (error) {
    console.log("iOS SharpSports bridge not available:", error);
  }
};

/**
 * Check if iOS bridge is available
 * @returns true if running in iOS WebView with message handlers
 */
export const isIOSBridgeAvailable = (): boolean => {
  return !!window.webkit?.messageHandlers;
};

/**
 * Log iOS bridge status for debugging
 */
export const logIOSBridgeStatus = () => {
  console.log('🔍 iOS Bridge Status:', {
    available: isIOSBridgeAvailable(),
    hasWebKit: !!window.webkit,
    hasMessageHandlers: !!window.webkit?.messageHandlers,
    hasAuthHandler: !!window.webkit?.messageHandlers?.authHandler,
    hasNavigationHandler: !!window.webkit?.messageHandlers?.navigationHandler,
    hasSharpSportHandler: !!window.webkit?.messageHandlers?.sharpsportHandler,
    hasLogger: !!window.webkit?.messageHandlers?.logger
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        authHandler?: {
          postMessage: (data: any) => void;
        };
        sharpsportHandler?: {
          postMessage: (data: any) => void;
        };
        navigationHandler?: {
          postMessage: (data: any) => void;
        };
        logger?: {
          postMessage: (data: any) => void;
        };
      };
    };
  }
}
