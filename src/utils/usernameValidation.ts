export const validateUsername = (value: string) => {
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
  if (!usernameToCheck) return null;

  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id")
      .ilike("username", usernameToCheck)
      .limit(1);

    if (error) return true;
    return !data || data.length === 0;
  } catch (error) {
    return true;
  }
};
