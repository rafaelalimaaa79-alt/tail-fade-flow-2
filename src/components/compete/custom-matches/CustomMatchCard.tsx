
import React from "react";
import { DollarSign, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Challenge } from "@/hooks/useChallenges";

interface CustomMatchCardProps {
  match: Challenge;
  onJoin: (challengeId: string) => void;
}

const CustomMatchCard: React.FC<CustomMatchCardProps> = ({ match, onJoin }) => {
  return (
    <Card className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-center w-full">
          {match.format === "1v1" ? "1v1 Challenge" : "2v2 Duos"}
        </h3>
        <div className="bg-blue-500/20 px-2 py-1 rounded text-xs font-semibold text-blue-500">
          PUBLIC
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span>${match.entry_fee / 100} Buy-in</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-purple-500" />
          <span>{match.duration_days} Day{match.duration_days > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-blue-500" />
          <span>Created by user #{match.creator_user_id.slice(0, 6)}</span>
        </div>
      </div>
      <Button 
        className="w-full mt-4 bg-primary hover:bg-primary/90"
        onClick={() => onJoin(match.id)}
      >
        Join Match
      </Button>
    </Card>
  );
};

export default CustomMatchCard;
