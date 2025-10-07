// Mock challenge service - database tables don't exist yet
import { toast } from "sonner";
import { Challenge } from "@/types/challenge";

// Mock data for challenges
const mockChallenges: Challenge[] = [
  {
    id: "1",
    type: "tournament",
    format: "multi",
    entry_fee: 50,
    duration_days: 3,
    min_bets_required: 5,
    status: "open",
    creator_user_id: "system",
    start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 5).toISOString(),
    pot_total_cents: 50000,
    rake_cents: 5000,
    created_at: new Date().toISOString(),
    participants_count: 8,
  },
  {
    id: "2",
    type: "fixed",
    format: "1v1",
    entry_fee: 25,
    duration_days: 2,
    min_bets_required: 3,
    status: "open",
    creator_user_id: "system",
    start_time: new Date(Date.now() + 86400000).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 3).toISOString(),
    pot_total_cents: 20000,
    rake_cents: 2000,
    created_at: new Date().toISOString(),
    participants_count: 4,
  },
];

export const fetchChallengesByType = async (type: "tournament" | "fixed" | "custom"): Promise<Challenge[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockChallenges.filter(c => c.type === type);
};

export const joinChallenge = async (challengeId: string): Promise<boolean> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success("Successfully joined challenge!");
    return true;
  } catch (error) {
    console.error("Error joining challenge:", error);
    toast.error("Failed to join challenge");
    return false;
  }
};

export const createCustomChallenge = async (
  format: "1v1" | "2v2",
  entryFee: number,
  durationDays: number
): Promise<boolean> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success("Custom challenge created!");
    return true;
  } catch (error) {
    console.error("Error creating challenge:", error);
    toast.error("Failed to create challenge");
    return false;
  }
};
