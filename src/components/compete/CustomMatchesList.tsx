
import React from "react";
import { DollarSign, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CustomMatchesList: React.FC = () => {
  return (
    <div className="space-y-4">
      <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90 mb-6">
        Create Custom Match
      </Button>

      <h2 className="text-lg font-semibold mb-2 text-center">Open Custom Matches</h2>
      <div className="space-y-4">
        <Card className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-center w-full">1v1 Challenge</h3>
            <div className="bg-blue-500/20 px-2 py-1 rounded text-xs font-semibold text-blue-500">
              PUBLIC
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>$50 Buy-in</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span>2 Days</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Created by u/ProPicker</span>
            </div>
          </div>
          <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
            Join Match
          </Button>
        </Card>

        <Card className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-center w-full">2v2 Duos</h3>
            <div className="bg-blue-500/20 px-2 py-1 rounded text-xs font-semibold text-blue-500">
              PUBLIC
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>$20 Buy-in</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span>3 Days</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <span>2/4 Users Joined</span>
            </div>
          </div>
          <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
            Join Match
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CustomMatchesList;
