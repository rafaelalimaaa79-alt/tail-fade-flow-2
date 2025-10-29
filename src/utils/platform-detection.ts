/**
 * Platform Detection Utilities
 * Detects if the app is running in an iOS WebView wrapper
 */

/**
 * Check if the app is running in an iOS WebView
 * @returns true if running in iOS WebView, false otherwise
 */
export const isIOSWebView = (): boolean => {
  // Check for iOS WebView
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  
  // Check if it's a WebView (not Safari)
  // Safari has 'Safari' in user agent, WebView doesn't
  const nav = window.navigator as Navigator & { standalone?: boolean };
  const isWebView = !nav.standalone && 
                    /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent);
  
  // Also check for webkit message handlers (our iOS bridge)
  const hasIOSBridge = !!window.webkit?.messageHandlers;
  
  return (isIOS && isWebView) || hasIOSBridge;
};

/**
 * Get the current platform
 * @returns 'ios-webview' or 'web'
 */
export const getPlatform = (): 'ios-webview' | 'web' => {
  return isIOSWebView() ? 'ios-webview' : 'web';
};

/**
 * Check if running on iOS (Safari or WebView)
 * @returns true if on iOS device
 */
export const isIOS = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

/**
 * Check if running in standalone mode (PWA)
 * @returns true if in standalone mode
 */
export const isStandalone = (): boolean => {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true || 
         window.matchMedia('(display-mode: standalone)').matches;
};

/**
 * Log platform information for debugging
 */
export const logPlatformInfo = () => {
  console.log('🔍 Platform Detection:', {
    isIOSWebView: isIOSWebView(),
    platform: getPlatform(),
    isIOS: isIOS(),
    isStandalone: isStandalone(),
    userAgent: window.navigator.userAgent,
    hasWebKit: !!window.webkit,
    hasMessageHandlers: !!window.webkit?.messageHandlers
  });
};

