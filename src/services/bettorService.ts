
// This file is kept for backward compatibility
// It re-exports the bettor service functionality from the new structure

export {
  fetchBettorSummary,
  fetchBettorHistory,
  fetchBettorActivity
} from './bettor/bettorService';

// Also export types if needed
export type { TimeFrame, BettorActivity } from './bettor/types';

