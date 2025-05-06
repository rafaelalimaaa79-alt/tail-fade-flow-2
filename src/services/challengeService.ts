
import { supabase } from "@/integrations/supabase/client";
import { Challenge } from "@/types/challenge";
import { toast } from "sonner";

// Function to fetch challenges by type
export const fetchChallengesByType = async (type: string): Promise<Challenge[]> => {
  // First fetch the challenges
  const { data: challenges, error: challengesError } = await supabase
    .from('challenges')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (challengesError) {
    console.error("Error fetching challenges:", challengesError);
    throw new Error(`Failed to fetch ${type} challenges`);
  }

  // Then fetch participant counts for each challenge
  const challengeIds = challenges.map(c => c.id);
  
  if (challengeIds.length === 0) {
    return [];
  }
  
  // Instead of trying to use group/count in the query, fetch all participants
  // and then count them in memory
  const { data: participants, error: countsError } = await supabase
    .from('challenge_participants')
    .select('challenge_id')
    .in('challenge_id', challengeIds);
  
  if (countsError) {
    console.error("Error fetching participant counts:", countsError);
    // Continue without counts rather than failing completely
  }
  
  // Create a map of challenge_id to count by counting occurrences
  const countMap: Record<string, number> = {};
  if (participants) {
    participants.forEach(item => {
      if (!countMap[item.challenge_id]) {
        countMap[item.challenge_id] = 0;
      }
      countMap[item.challenge_id]++;
    });
  }
  
  // Merge the challenges with their participant counts
  return challenges.map(challenge => ({
    ...challenge,
    type: challenge.type as "tournament" | "fixed" | "custom",
    format: challenge.format as "1v1" | "2v2" | "multi",
    status: challenge.status as "open" | "in_progress" | "completed",
    participants_count: countMap[challenge.id] || 0
  }));
};

// Function to join a challenge
export const joinChallenge = async (challengeId: string) => {
  try {
    // Get session
    const { data: session } = await supabase.auth.getSession();
    
    // For testing: if not logged in, generate a valid UUID instead of a random string
    let userId;
    
    if (session.session?.user?.id) {
      userId = session.session.user.id;
    } else {
      // Generate a proper UUID using crypto API if available, fallback to a fixed test UUID
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        userId = crypto.randomUUID();
      } else {
        // Fallback to a fixed test UUID that's guaranteed to be valid format
        userId = "00000000-0000-4000-a000-000000000000"; // Test UUID in valid format
      }
    }
    
    console.log("Joining challenge with user ID:", userId);
    
    // Check if this user already joined this challenge
    try {
      const { data: participants, error: checkError } = await supabase
        .from('challenge_participants')
        .select('id')
        .eq('challenge_id', challengeId)
        .eq('user_id', userId);
      
      if (checkError) {
        console.error("Error checking challenge participation:", checkError);
        toast.error("Failed to verify participation status");
        return false;
      }
      
      if (participants && participants.length > 0) {
        toast.error("You've already joined this challenge");
        return false;
      }
      
      console.log("Inserting new participant for challenge:", challengeId);
      
      // Join the challenge with the user ID (real or test)
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: userId,
        });
    
      if (error) {
        console.error("Error joining challenge:", error);
        toast.error("Failed to join challenge");
        return false;
      }
    
      toast.success("Successfully joined challenge!");
      return true;
    } catch (err) {
      console.error("Exception checking participation:", err);
      toast.error("An unexpected error occurred");
      return false;
    }
  } catch (error) {
    console.error("Unexpected error in joinChallenge:", error);
    toast.error("An unexpected error occurred");
    return false;
  }
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
