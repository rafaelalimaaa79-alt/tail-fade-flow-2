
import React, { useState } from "react";
import { DollarSign, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChallengesByType, joinChallenge, createCustomChallenge, Challenge } from "@/hooks/useChallenges";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CreateCustomMatchDialog: React.FC<{ onMatchCreated: () => void }> = ({ onMatchCreated }) => {
  const [format, setFormat] = useState<"1v1" | "2v2">("1v1");
  const [buyIn, setBuyIn] = useState(10);
  const [durationDays, setDurationDays] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateMatch = async () => {
    setIsCreating(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast.error("You must be logged in to create a match");
        return;
      }
      
      const result = await createCustomChallenge(format, buyIn, durationDays);
      
      if (result) {
        toast.success("Custom match created successfully!");
        setIsOpen(false);
        onMatchCreated();
      }
    } catch (error) {
      console.error("Error creating match:", error);
      toast.error("Failed to create match. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90 mb-6">
          Create Custom Match
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Custom Match</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Match Format</Label>
            <RadioGroup 
              value={format} 
              onValueChange={(value) => setFormat(value as "1v1" | "2v2")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1v1" id="format-1v1" />
                <Label htmlFor="format-1v1">1v1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2v2" id="format-2v2" />
                <Label htmlFor="format-2v2">2v2</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Buy-In Amount</Label>
              <span>${buyIn}</span>
            </div>
            <Slider
              value={[buyIn]}
              min={5}
              max={100}
              step={5}
              onValueChange={(values) => setBuyIn(values[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Duration (Days)</Label>
              <span>{durationDays} day{durationDays > 1 ? 's' : ''}</span>
            </div>
            <Slider
              value={[durationDays]}
              min={1}
              max={7}
              step={1}
              onValueChange={(values) => setDurationDays(values[0])}
            />
          </div>
        </div>

        <Button 
          onClick={handleCreateMatch} 
          className="w-full"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Match"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

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
        <div className="text-center py-8">Loading custom matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <CreateCustomMatchDialog onMatchCreated={handleMatchCreated} />
        <div className="text-center text-red-500 py-8">Failed to load custom matches</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CreateCustomMatchDialog onMatchCreated={handleMatchCreated} />

      <h2 className="text-lg font-semibold mb-2 text-center">Open Custom Matches</h2>
      
      {customChallenges.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No custom matches available. Create one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {customChallenges.map((match) => (
            <Card key={match.id} className="p-4 border border-white/10 bg-card hover:shadow-lg transition-all">
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
                onClick={() => handleJoin(match.id)}
              >
                Join Match
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomMatchesList;
