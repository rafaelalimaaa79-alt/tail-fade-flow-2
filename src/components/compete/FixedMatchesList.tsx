
import React from "react";
import { DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MatchOption {
  buyIn: number;
  days: number;
}

const FixedMatchesList: React.FC = () => {
  const oneVsOneMatches: MatchOption[] = [
    { buyIn: 5, days: 1 },
    { buyIn: 10, days: 2 },
    { buyIn: 25, days: 3 }
  ];
  
  const duoMatches: MatchOption[] = [
    { buyIn: 5, days: 2 },
    { buyIn: 10, days: 3 }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2 text-center">1v1 Matches</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        {oneVsOneMatches.map((match, index) => (
          <Card key={index} className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
            <h3 className="text-lg font-bold">1v1 Challenge</h3>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>${match.buyIn} Buy-in</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span>{match.days} Day{match.days > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Win ${(match.buyIn * 1.9).toFixed(2)} by beating your random opponent
            </div>
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
              Join Now
            </Button>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2 text-center">2v2 Duos</h2>
      <div className="grid grid-cols-1 gap-4">
        {duoMatches.map((match, index) => (
          <Card key={index} className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
            <h3 className="text-lg font-bold">2v2 Duos</h3>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>${match.buyIn} Buy-in</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span>{match.days} Days</span>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Team up with a random partner to win ${(match.buyIn * 3.8).toFixed(2)}
            </div>
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
              Join Now
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FixedMatchesList;
