
export const validateUsername = (value: string) => {
  // Only allow letters, numbers, and underscores
  const validPattern = /^[a-zA-Z0-9_]*$/;
  
  if (value.length > 0 && !validPattern.test(value)) {
    return "Only letters, numbers, and underscores allowed";
  }
  
  if (value.length > 0 && value.length <= 8) {
    return "Username must be more than 8 characters";
  }
  
  if (value.length > 20) {
    return "Username must be 20 characters or less";
  }
  
  return "";
};

export const checkUsernameAvailability = async (usernameToCheck: string): Promise<boolean | null> => {
  if (!usernameToCheck) {
    return null;
  }

  try {
    // Import supabase client dynamically to avoid circular dependencies
    const { supabase } = await import("@/integrations/supabase/client");

    // Query the database to check if username already exists
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id")
      .ilike("username", usernameToCheck)
      .limit(1);

    if (error) {
      console.error("Error checking username availability:", error);
      // If there's an error, assume it's available to not block the user
      return true;
    }

    // If data is empty, username is available; if data has items, it's taken
    const available = !data || data.length === 0;
    return available;
  } catch (error) {
    console.error("Error in checkUsernameAvailability:", error);
    // If there's an error, assume it's available to not block the user
    return true;
  }
};
