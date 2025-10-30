// Placeholder hook - to be reimplemented
export const useMessagesRealtime = () => {
  return { 
    messages: [], 
    loading: false,
    isLoading: false,
    sendMessage: async (content: string, userId: string) => {}
  };
};
