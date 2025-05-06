import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define types for our challenge data
export interface Challenge {
  id: string;
  type: "tournament" | "fixed" | "custom";
  format: "1v1" | "2v2" | "multi";
  entry_fee: number;
  duration_days: number;
  min_bets_required: number;
  status: "open" | "in_progress" | "completed";
  creator_user_id: string;
  start_time: string | null;
  end_time: string | null;
  pot_total_cents: number;
  rake_cents: number;
  created_at: string;
  participants_count?: number;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  team: string | null;
  units_gained: number;
  bets_placed: number;
  is_winner: boolean;
  is_eliminated: boolean;
  joined_at: string;
}

// Function to fetch challenges by type
const fetchChallengesByType = async (type: string): Promise<Challenge[]> => {
  const { data, error } = await supabase
    .from('challenges')
    .select('*, challenge_participants(count)')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching challenges:", error);
    throw new Error(`Failed to fetch ${type} challenges`);
  }

  // Process the data to include participant count and ensure proper typing
  return data.map(challenge => ({
    ...challenge,
    type: challenge.type as "tournament" | "fixed" | "custom",
    format: challenge.format as "1v1" | "2v2" | "multi",
    status: challenge.status as "open" | "in_progress" | "completed",
    participants_count: challenge.challenge_participants[0]?.count || 0
  }));
};

// Custom hook to get challenges by type
export const useChallengesByType = (type: "tournament" | "fixed" | "custom") => {
  return useQuery<Challenge[], Error>({
    queryKey: ['challenges', type],
    queryFn: () => fetchChallengesByType(type),
    onError: (error) => {
      toast.error(`Failed to load ${type} challenges`);
      console.error(error);
    }
  });
};

// Function to join a challenge
export const joinChallenge = async (challengeId: string) => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    toast.error("You must be logged in to join a challenge");
    return false;
  }

  const { error } = await supabase
    .from('challenge_participants')
    .insert({
      challenge_id: challengeId,
      user_id: session.session.user.id,
    });

  if (error) {
    if (error.code === '23505') { // Unique violation
      toast.error("You've already joined this challenge");
    } else {
      toast.error("Failed to join challenge");
      console.error("Error joining challenge:", error);
    }
    return false;
  }

  toast.success("Successfully joined challenge!");
  return true;
};

// Function to create a custom challenge
export const createCustomChallenge = async (
  format: "1v1" | "2v2",
  entryFee: number,
  durationDays: number
) => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    toast.error("You must be logged in to create a challenge");
    return null;
  }

  const { data, error } = await supabase
    .from('challenges')
    .insert({
      type: 'custom',
      format,
      entry_fee: entryFee * 100, // Convert to cents
      duration_days: durationDays,
      creator_user_id: session.session.user.id,
    })
    .select()
    .single();

  if (error) {
    toast.error("Failed to create challenge");
    console.error("Error creating challenge:", error);
    return null;
  }

  toast.success("Challenge created successfully!");
  return data;
};
