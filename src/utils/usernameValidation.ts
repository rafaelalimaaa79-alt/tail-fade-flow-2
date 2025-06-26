
export const validateUsername = (value: string) => {
  // Only allow letters, numbers, and underscores
  const validPattern = /^[a-zA-Z0-9_]*$/;
  
  if (!validPattern.test(value)) {
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

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock some taken usernames for demo
  const takenUsernames = ["coldpublic", "publicfader", "sharps", "admin", "fadezone"];
  const available = !takenUsernames.includes(usernameToCheck.toLowerCase());
  
  return available;
};
