
import React from "react";
import { DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChallengesByType, joinChallenge, Challenge } from "@/hooks/useChallenges";
import LoadingState from "./shared/LoadingState";
import ErrorState from "./shared/ErrorState";

const FixedMatchesList: React.FC = () => {
  const { data: fixedChallenges = [], isLoading, error } = useChallengesByType("fixed");
  
  const handleJoin = async (challengeId: string) => {
    await joinChallenge(challengeId);
  };

  if (isLoading) {
    return <LoadingState message="Loading fixed matches..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load fixed matches" />;
  }

  // Filter challenges by format
  const oneVsOneMatches = fixedChallenges.filter(challenge => challenge.format === "1v1");
  const duoMatches = fixedChallenges.filter(challenge => challenge.format === "2v2");

  if (oneVsOneMatches.length === 0 && duoMatches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">No fixed matches available at the moment.</p>
        <p className="text-sm text-muted-foreground">Check back soon for new matches!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {oneVsOneMatches.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2 text-center">1v1 Matches</h2>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {oneVsOneMatches.map((match) => (
              <Card key={match.id} className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-bold text-center">1v1 Challenge</h3>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>${match.entry_fee / 100} Buy-in</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span>{match.duration_days} Day{match.duration_days > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Win ${(match.entry_fee * 1.9 / 100).toFixed(2)} by beating your random opponent
                </div>
                <Button 
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                  onClick={() => handleJoin(match.id)}
                >
                  Join Now
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}

      {duoMatches.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2 text-center">2v2 Duos</h2>
          <div className="grid grid-cols-1 gap-4">
            {duoMatches.map((match) => (
              <Card key={match.id} className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-bold text-center">2v2 Duos</h3>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>${match.entry_fee / 100} Buy-in</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span>{match.duration_days} Days</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Team up with a random partner to win ${(match.entry_fee * 3.8 / 100).toFixed(2)}
                </div>
                <Button 
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                  onClick={() => handleJoin(match.id)}
                >
                  Join Now
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FixedMatchesList;
