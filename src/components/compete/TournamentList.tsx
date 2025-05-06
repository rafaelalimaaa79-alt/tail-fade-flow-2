
import React from "react";
import { DollarSign, Timer, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChallengesByType, joinChallenge } from "@/hooks/useChallenges";
import { formatDistanceToNow } from 'date-fns';

const TournamentList: React.FC = () => {
  const { data: tournaments, isLoading, error } = useChallengesByType("tournament");

  const handleJoin = async (challengeId: string) => {
    await joinChallenge(challengeId);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading tournaments...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Failed to load tournaments</div>;
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">No active tournaments at the moment.</p>
        <p className="text-sm text-muted-foreground mb-6">Check back soon for new tournaments!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tournaments.map((tournament) => (
        <Card 
          key={tournament.id} 
          className="p-4 overflow-hidden relative border border-white/10 bg-card hover:shadow-lg transition-all"
        >
          <div className="absolute top-0 right-0 bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            {tournament.status === 'in_progress' ? 'LIVE' : 'STARTING SOON'}
          </div>
          <h3 className="text-lg font-bold text-center">
            {tournament.format === '1v1' ? '1v1 Tournament' : 
             tournament.format === '2v2' ? '2v2 Tournament' : 
             'Multi-User Tournament'}
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>${tournament.entry_fee / 100} Entry</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4 text-yellow-500" />
              <span>
                {tournament.start_time ? 
                  `Started ${formatDistanceToNow(new Date(tournament.start_time))} ago` : 
                  'Starting soon'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <span>{tournament.participants_count || 0}/50 Spots</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span>{tournament.duration_days}-day event</span>
            </div>
          </div>
          <Button 
            className="w-full mt-4 bg-primary hover:bg-primary/90"
            onClick={() => handleJoin(tournament.id)}
          >
            Join Tournament
          </Button>
        </Card>
      ))}

      <div className="flex justify-center my-6">
        <Button variant="outline" className="text-muted-foreground">
          View Past Tournaments
        </Button>
      </div>
    </div>
  );
};

export default TournamentList;
