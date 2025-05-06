
import React from "react";
import { DollarSign, Timer, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const TournamentList: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card className="p-4 overflow-hidden relative border border-white/10 bg-card hover:shadow-lg transition-all">
        <div className="absolute top-0 right-0 bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
          LIVE
        </div>
        <h3 className="text-lg font-bold text-center">3-Day Heater</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>$10 Entry</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Timer className="h-4 w-4 text-yellow-500" />
            <span>2 days left</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-blue-500" />
            <span>36/50 Spots</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>Ends Apr 9</span>
          </div>
        </div>
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
          Join Tournament
        </Button>
      </Card>

      <Card className="p-4 overflow-hidden relative border border-white/10 bg-card hover:shadow-lg transition-all">
        <div className="absolute top-0 right-0 bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-500">
          STARTING SOON
        </div>
        <h3 className="text-lg font-bold text-center">Weekend Warrior</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>$25 Entry</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Timer className="h-4 w-4 text-yellow-500" />
            <span>Starts in 3h</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-blue-500" />
            <span>18/50 Spots</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>3-day event</span>
          </div>
        </div>
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
          Join Tournament
        </Button>
      </Card>

      <div className="flex justify-center my-6">
        <Button variant="outline" className="text-muted-foreground">
          View Past Tournaments
        </Button>
      </div>
    </div>
  );
};

export default TournamentList;
