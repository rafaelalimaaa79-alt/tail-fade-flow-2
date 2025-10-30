/**
 * Sync Response Handler
 * Handles all possible responses from the sync-bets Edge Function
 */

export type SyncStatus = 
  | 'success'
  | 'otp_required'
  | 'relink_required'
  | 'rate_limited'
  | 'unverifiable'
  | 'book_inactive'
  | 'region_inactive'
  | 'sdk_required'
  | 'extension_update_required'
  | 'no_accounts_refreshed'
  | 'error';

export interface SyncResponse {
  status: SyncStatus;
  message?: string;
  
  // Success fields
  inserted?: number;
  pending?: number;
  historical?: number;
  refreshedAccounts?: string[];
  scope?: string;
  
  // OTP/Relink fields
  cid?: string;
  otpUrl?: string;
  linkUrl?: string;
  accounts?: string[];
  
  // Rate limit fields
  retryAfter?: number;
  
  // Error fields
  error?: string;
  detail?: string;
  
  // Extension update
  extensionDownloadUrl?: string;
}

export interface SyncCallbacks {
  onSuccess?: (data: SyncResponse) => void;
  onOtpRequired?: (otpUrl: string, cid: string, accounts: string[]) => void;
  onRelinkRequired?: (linkUrl: string, cid: string, accounts: string[]) => void;
  onRateLimited?: (retryAfter: number, message: string) => void;
  onError?: (message: string, status: SyncStatus) => void;
}

/**
 * Handle sync response and call appropriate callbacks
 */
export const handleSyncResponse = (
  data: SyncResponse,
  callbacks: SyncCallbacks
) => {
  console.log('Handling sync response:', data);

  switch (data.status) {
    case 'success':
      callbacks.onSuccess?.(data);
      break;
      
    case 'otp_required':
      if (data.otpUrl && data.cid) {
        callbacks.onOtpRequired?.(
          data.otpUrl, 
          data.cid, 
          data.accounts || []
        );
      } else {
        callbacks.onError?.('Invalid OTP response from server', data.status);
      }
      break;
      
    case 'relink_required':
      if (data.linkUrl && data.cid) {
        callbacks.onRelinkRequired?.(
          data.linkUrl, 
          data.cid, 
          data.accounts || []
        );
      } else {
        callbacks.onError?.('Invalid relink response from server', data.status);
      }
      break;
      
    case 'rate_limited':
      callbacks.onRateLimited?.(
        data.retryAfter || 60,
        data.message || 'Too many requests. Please wait and try again.'
      );
      break;
      
    case 'unverifiable':
    case 'book_inactive':
    case 'region_inactive':
    case 'sdk_required':
    case 'extension_update_required':
    case 'no_accounts_refreshed':
    case 'error':
    default:
      callbacks.onError?.(
        SYNC_ERROR_MESSAGE,
        data.status
      );
      break;
  }
};

/**
 * Generic error message for sync failures
 */
export const SYNC_ERROR_MESSAGE = 'Re-syncing failed. Try again in 1 minute.';

/**
 * Format sync success message
 */
export const formatSyncSuccessMessage = (data: SyncResponse): string => {
  if (data.inserted === 0) {
    return 'No new bets found';
  }

  const parts: string[] = [];

  if (data.pending && data.pending > 0) {
    parts.push(`${data.pending} pending`);
  }

  if (data.historical && data.historical > 0) {
    parts.push(`${data.historical} completed`);
  }

  if (parts.length === 0) {
    return `Synced ${data.inserted} bets`;
  }

  return `Synced ${data.inserted} bets (${parts.join(', ')})`;
};

