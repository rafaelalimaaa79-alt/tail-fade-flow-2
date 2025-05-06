
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Challenge } from "@/types/challenge";
import { fetchChallengesByType } from "@/services/challengeService";

// Custom hook to get challenges by type
export const useChallengesByType = (type: "tournament" | "fixed" | "custom") => {
  return useQuery<Challenge[], Error>({
    queryKey: ['challenges', type],
    queryFn: () => fetchChallengesByType(type),
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to load ${type} challenges`);
        console.error(error);
      }
    }
  });
};
