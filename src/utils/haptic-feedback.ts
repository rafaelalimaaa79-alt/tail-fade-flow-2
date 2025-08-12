/**
 * Haptic feedback utility for mobile devices
 * Provides standardized haptic patterns across the app
 */

type HapticType = 
  | 'selectionChanged'
  | 'impactLight' 
  | 'impactMedium'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError';

const hapticPatterns: Record<HapticType, number | number[]> = {
  selectionChanged: 50,
  impactLight: 30,
  impactMedium: 100,
  notificationSuccess: [100, 50, 100],
  notificationWarning: [150, 50, 150],
  notificationError: [200, 100, 200]
};

/**
 * Trigger haptic feedback if available on the device
 */
export const triggerHaptic = (type: HapticType): void => {
  if (!navigator.vibrate) {
    return; // Haptic not supported
  }

  const pattern = hapticPatterns[type];
  
  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

/**
 * Trigger haptic for refresh operations based on result
 */
export const triggerRefreshHaptic = (result: 'success' | 'warning' | 'error'): void => {
  const hapticMap = {
    success: 'notificationSuccess' as const,
    warning: 'notificationWarning' as const,
    error: 'notificationError' as const
  };
  
  triggerHaptic(hapticMap[result]);
};