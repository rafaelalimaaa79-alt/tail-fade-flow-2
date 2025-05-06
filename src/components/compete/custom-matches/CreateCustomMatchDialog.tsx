
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createCustomChallenge } from "@/hooks/useChallenges";

interface CreateCustomMatchDialogProps {
  onMatchCreated: () => void;
}

const CreateCustomMatchDialog: React.FC<CreateCustomMatchDialogProps> = ({ onMatchCreated }) => {
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

export default CreateCustomMatchDialog;
