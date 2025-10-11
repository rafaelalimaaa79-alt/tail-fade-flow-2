/**
 * Safe localStorage utilities with error handling and quota management
 */

/**
 * Safely set an item in localStorage with error handling
 * @param key - The key to set
 * @param value - The value to set
 * @returns true if successful, false otherwise
 */
export const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    
    // Verify it was actually set
    const stored = localStorage.getItem(key);
    if (stored !== value) {
      console.error(`localStorage.setItem failed silently for key: ${key}`);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error(`localStorage.setItem failed for key: ${key}`, e);
    
    // Try to free up space by removing old items
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.log('localStorage quota exceeded, attempting cleanup...');
      
      // Remove non-critical items
      const nonCriticalKeys = ['guestMode'];
      nonCriticalKeys.forEach(k => {
        try {
          localStorage.removeItem(k);
        } catch {}
      });
      
      // Try again
      try {
        localStorage.setItem(key, value);
        console.log('localStorage.setItem succeeded after cleanup');
        return true;
      } catch {
        console.error('localStorage.setItem failed even after cleanup');
        return false;
      }
    }
    
    return false;
  }
};

/**
 * Safely get an item from localStorage with error handling
 * @param key - The key to get
 * @returns The value or null if not found or error
 */
export const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error(`localStorage.getItem failed for key: ${key}`, e);
    return null;
  }
};

/**
 * Safely remove an item from localStorage with error handling
 * @param key - The key to remove
 * @returns true if successful, false otherwise
 */
export const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`localStorage.removeItem failed for key: ${key}`, e);
    return false;
  }
};

