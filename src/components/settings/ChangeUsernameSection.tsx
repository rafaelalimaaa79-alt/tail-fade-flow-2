import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validateUsername, checkUsernameAvailability } from "@/utils/usernameValidation";

interface ChangeUsernameSectionProps {
  currentUsername: string | null;
  userId: string;
  onUsernameChanged?: (newUsername: string) => void;
}

const ChangeUsernameSection = ({
  currentUsername,
  userId,
  onUsernameChanged,
}: ChangeUsernameSectionProps) => {
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Validate and check availability when username changes
  useEffect(() => {
    const handleUsernameChange = async () => {
      const validationError = validateUsername(newUsername);
      setError(validationError);

      // Only check availability if there's no validation error and username has content
      if (!validationError && newUsername.length > 8) {
        setIsChecking(true);
        const available = await checkUsernameAvailability(newUsername);
        setIsAvailable(available);
        setIsChecking(false);
      } else {
        setIsAvailable(null);
        setIsChecking(false);
      }
    };

    const debounceTimer = setTimeout(handleUsernameChange, 300);
    return () => clearTimeout(debounceTimer);
  }, [newUsername]);

  const handleSaveUsername = async () => {
    if (!newUsername || error || !isAvailable) {
      toast.error("Please enter a valid and available username");
      return;
    }

    setIsSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          username: newUsername,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating username:", updateError);
        toast.error("Failed to update username. Please try again.");
        return;
      }

      toast.success("Username updated successfully!");
      setNewUsername("");
      setIsAvailable(null);
      setError(null);

      if (onUsernameChanged) {
        onUsernameChanged(newUsername);
      }
    } catch (err: any) {
      console.error("Error saving username:", err);
      toast.error("An error occurred while updating your username");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = newUsername && !error && isAvailable && !isSaving;

  return (
    <Card className="bg-black border border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-rajdhani">Change Username</CardTitle>
        <CardDescription className="text-gray-400">
          Update your username to something new
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Username (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Username
          </label>
          <Input
            type="text"
            value={currentUsername || "Not set"}
            readOnly
            className="bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* New Username Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            New Username
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter new username (min 8 characters)"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 pr-10"
            />
            {/* Status Icon */}
            {newUsername && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isChecking ? (
                  <Loader2 className="h-5 w-5 text-[#AEE3F5] animate-spin" />
                ) : isAvailable ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : error || !isAvailable ? (
                  <X className="h-5 w-5 text-red-500" />
                ) : null}
              </div>
            )}
          </div>

          {/* Validation/Availability Messages */}
          {newUsername && (
            <div className="mt-2">
              {error ? (
                <p className="text-sm text-red-400">{error}</p>
              ) : isChecking ? (
                <p className="text-sm text-[#AEE3F5]">Checking availability...</p>
              ) : isAvailable ? (
                <p className="text-sm text-green-400">✓ Username is available</p>
              ) : isAvailable === false ? (
                <p className="text-sm text-red-400">✗ Username is already taken</p>
              ) : null}
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSaveUsername}
          disabled={!isFormValid}
          className={`w-full font-bold py-2 rounded-lg transition-all ${
            isFormValid
              ? "bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChangeUsernameSection;

