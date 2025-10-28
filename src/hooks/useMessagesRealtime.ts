import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
}

export const useMessagesRealtime = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useState<RealtimeChannel | null>(null)[1];

  // Load initial messages
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Fetch usernames for all messages
      const messagesWithUsernames = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('id', msg.user_id)
            .single();

          return {
            ...msg,
            username: profile?.username || 'Anonymous',
          };
        })
      );

      setMessages(messagesWithUsernames);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMessage);
      console.error('Error loading messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMessage = payload.new as any;

          // Fetch username for the new message
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('id', newMessage.user_id)
            .single();

          const messageWithUsername: Message = {
            ...newMessage,
            username: profile?.username || 'Anonymous',
          };

          setMessages((prev) => [...prev, messageWithUsername]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [loadMessages]);

  // Send a new message
  const sendMessage = useCallback(
    async (content: string, userId: string) => {
      try {
        const { data, error: insertError } = await supabase
          .from('messages')
          .insert({
            user_id: userId,
            content,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        console.error('Error sending message:', err);
        throw new Error(errorMessage);
      }
    },
    []
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};

