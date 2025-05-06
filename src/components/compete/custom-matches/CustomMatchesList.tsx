
import React from "react";
import { useChallengesByType, joinChallenge, Challenge } from "@/hooks/useChallenges";
import CreateCustomMatchDialog from "./CreateCustomMatchDialog";
import CustomMatchCard from "./CustomMatchCard";
import EmptyMatchesState from "./EmptyMatchesState";
import LoadingState from "@/components/compete/shared/LoadingState";
import ErrorState from "@/components/compete/shared/ErrorState";

const CustomMatchesList: React.FC = () => {
  const { data: customChallenges = [], isLoading, error, refetch } = useChallengesByType("custom");
  
  const handleJoin = async (challengeId: string) => {
    const success = await joinChallenge(challengeId);
    if (success) {
      refetch();
    }
  };

  const handleMatchCreated = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CreateCustomMatchDialog onMatchCreated={handleMatchCreated} />
        <LoadingState message="Loading custom matches..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <CreateCustomMatchDialog onMatchCreated={handleMatchCreated} />
        <ErrorState message="Failed to load custom matches" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CreateCustomMatchDialog onMatchCreated={handleMatchCreated} />

      <h2 className="text-lg font-semibold mb-2 text-center">Open Custom Matches</h2>
      
      {customChallenges.length === 0 ? (
        <EmptyMatchesState message="No custom matches available. Create one!" />
      ) : (
        <div className="space-y-4">
          {customChallenges.map((match) => (
            <CustomMatchCard 
              key={match.id} 
              match={match} 
              onJoin={handleJoin} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomMatchesList;
