
// Re-export all challenge hooks and functions for backward compatibility
export { useChallengesByType } from './useChallengesByType';
export { joinChallenge, createCustomChallenge } from '@/services/challengeService';
export type { Challenge, ChallengeParticipant } from '@/types/challenge';
