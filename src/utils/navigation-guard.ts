/**
 * Navigation Guard for iOS WebView
 * Prevents accidental top-level window navigations that would break the app
 */

import { isIOSWebView } from './platform-detection';

let isGuardActive = false;

/**
 * Setup navigation guard to prevent unwanted redirects in iOS WebView
 * This should be called once when the app initializes
 */
export const setupNavigationGuard = () => {
  if (!isIOSWebView() || isGuardActive) {
    return;
  }

  console.log('🛡️ Setting up iOS WebView navigation guard');
  isGuardActive = true;

  // Monitor navigation attempts
  window.addEventListener('beforeunload', (e) => {
    console.log('⚠️ Navigation attempt detected (beforeunload)');
  });

  // Intercept clicks on links that might cause navigation
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.href) {
      const url = new URL(link.href, window.location.origin);
      const isExternal = url.origin !== window.location.origin;
      const hasTarget = link.target && link.target !== '_self';
      
      // Log external link clicks
      if (isExternal) {
        console.log('🔗 External link clicked:', {
          href: link.href,
          target: link.target,
          origin: url.origin
        });
        
        // If it's a target="_blank" or external link, prevent default
        // and let the iOS WebView handle it (it will block it)
        if (hasTarget || url.hostname.includes('sharpsports.io')) {
          console.log('🚫 Preventing external link navigation');
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }
  }, true); // Use capture phase to catch early

  // Monitor hash changes (used for completion detection)
  window.addEventListener('hashchange', (e) => {
    console.log('🔗 Hash changed:', {
      oldURL: e.oldURL,
      newURL: e.newURL,
      hash: window.location.hash
    });
  });

  console.log('✅ Navigation guard active');
};

/**
 * Check if a URL is safe to navigate to in iOS WebView
 * @param url - URL to check
 * @returns true if safe, false if should be blocked
 */
export const isSafeNavigation = (url: string): boolean => {
  try {
    const urlObj = new URL(url, window.location.origin);
    const appDomain = 'tail-fade-flow.vercel.app';
    
    // Allow same origin
    if (urlObj.origin === window.location.origin) {
      return true;
    }
    
    // Allow app domain
    if (urlObj.hostname === appDomain) {
      return true;
    }
    
    // Allow localhost for development
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      return true;
    }
    
    // Block everything else in main window
    return false;
  } catch (error) {
    console.error('Error checking URL safety:', error);
    return false;
  }
};

/**
 * Notify iOS app of navigation events
 * @param event - Navigation event type
 * @param data - Event data
 */
export const notifyIOSNavigation = (event: string, data: any) => {
  if (!isIOSWebView()) {
    return;
  }

  try {
    if (window.webkit?.messageHandlers?.navigationHandler) {
      window.webkit.messageHandlers.navigationHandler.postMessage({
        event,
        data,
        timestamp: Date.now()
      });
      console.log('📱 Sent navigation event to iOS:', event, data);
    }
  } catch (error) {
    console.log('Failed to send navigation event to iOS:', error);
  }
};

/**
 * Prevent window.location assignments (aggressive protection)
 * WARNING: This is a nuclear option and may break some functionality
 * Only use if absolutely necessary
 */
export const preventWindowLocationAssignment = () => {
  if (!isIOSWebView()) {
    return;
  }

  console.log('🚨 Activating aggressive window.location protection');

  // Store original location
  const originalLocation = window.location;
  
  // This is tricky and may not work in all cases
  // Modern browsers prevent this for security reasons
  try {
    Object.defineProperty(window, 'location', {
      get: () => originalLocation,
      set: (value) => {
        console.warn('🚫 BLOCKED: Attempted window.location assignment:', value);
        notifyIOSNavigation('blocked_location_assignment', { value });
        // Don't actually navigate
        return originalLocation;
      },
      configurable: false
    });
    console.log('✅ window.location protection active');
  } catch (error) {
    console.log('⚠️ Could not override window.location (browser security):', error);
  }
};

