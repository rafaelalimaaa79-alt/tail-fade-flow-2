import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface MessageReaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
  reactions?: Record<string, MessageReaction>;
}

export const useMessagesRealtime = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

  // Helper function to fetch reactions for a message
  const fetchReactionsForMessage = useCallback(async (messageId: string) => {
    try {
      const { data: reactions } = await supabase
        .from('message_reactions')
        .select('emoji, user_id')
        .eq('message_id', messageId);

      const reactionsMap: Record<string, MessageReaction> = {};

      if (reactions) {
        reactions.forEach((reaction) => {
          if (!reactionsMap[reaction.emoji]) {
            reactionsMap[reaction.emoji] = {
              emoji: reaction.emoji,
              count: 0,
              userReacted: false,
            };
          }
          reactionsMap[reaction.emoji].count += 1;
          if (reaction.user_id === currentUserIdRef.current) {
            reactionsMap[reaction.emoji].userReacted = true;
          }
        });
      }

      return reactionsMap;
    } catch (err) {
      console.error('Error fetching reactions:', err);
      return {};
    }
  }, []);

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

      // Fetch usernames and reactions for all messages
      const messagesWithData = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('id', msg.user_id)
            .single();

          const reactions = await fetchReactionsForMessage(msg.id);

          return {
            ...msg,
            username: profile?.username || 'Anonymous',
            reactions,
          };
        })
      );

      setMessages(messagesWithData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMessage);
      console.error('Error loading messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchReactionsForMessage]);

  // Subscribe to real-time changes
  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserIdRef.current = user?.id || null;
    };

    getCurrentUser();
    loadMessages();

    const channel = supabase
      .channel('public:messages', {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          console.log('📨 New message received:', payload);
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
            reactions: {},
          };

          console.log('✅ Adding message to state:', messageWithUsername);
          setMessages((prev) => [...prev, messageWithUsername]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_reactions',
        },
        (payload) => {
          console.log('😊 New reaction received:', payload);
          const reaction = payload.new as any;

          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === reaction.message_id) {
                const reactions = msg.reactions ? { ...msg.reactions } : {};
                const emoji = reaction.emoji;

                if (!reactions[emoji]) {
                  reactions[emoji] = {
                    emoji,
                    count: 1,
                    userReacted: reaction.user_id === currentUserIdRef.current,
                  };
                } else {
                  // Create a new object to ensure immutability
                  reactions[emoji] = {
                    ...reactions[emoji],
                    count: reactions[emoji].count + 1,
                    userReacted: reaction.user_id === currentUserIdRef.current ? true : reactions[emoji].userReacted,
                  };
                }

                return { ...msg, reactions };
              }
              return msg;
            })
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'message_reactions',
        },
        (payload) => {
          console.log('😢 Reaction removed:', payload);
          const reaction = payload.old as any;

          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === reaction.message_id) {
                const reactions = msg.reactions ? { ...msg.reactions } : {};
                const emoji = reaction.emoji;

                if (reactions[emoji]) {
                  const newCount = reactions[emoji].count - 1;

                  if (newCount === 0) {
                    // Remove the emoji entirely if count reaches 0
                    const { [emoji]: _, ...remainingReactions } = reactions;
                    return { ...msg, reactions: remainingReactions };
                  } else {
                    // Update the reaction with new count
                    reactions[emoji] = {
                      ...reactions[emoji],
                      count: newCount,
                      userReacted: reaction.user_id === currentUserIdRef.current ? false : reactions[emoji].userReacted,
                    };
                  }
                }

                return { ...msg, reactions };
              }
              return msg;
            })
          );
        }
      )
      .subscribe((status) => {
        console.log('🔌 Realtime subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('🔌 Unsubscribing from realtime channel');
        channelRef.current.unsubscribe();
      }
    };
  }, [loadMessages, fetchReactionsForMessage]);

  // Send a new message
  const sendMessage = useCallback(
    async (content: string, userId: string) => {
      try {
        console.log('📤 Sending message:', { content, userId });
        const { data, error: insertError } = await supabase
          .from('messages')
          .insert({
            user_id: userId,
            content,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        console.log('✅ Message sent successfully:', data);
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        console.error('❌ Error sending message:', err);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Add a reaction to a message
  const addReaction = useCallback(
    async (messageId: string, emoji: string, userId: string) => {
      try {
        const { error } = await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: userId,
            emoji,
          });

        if (error) throw error;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add reaction';
        console.error('❌ Error adding reaction:', err);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Remove a reaction from a message
  const removeReaction = useCallback(
    async (messageId: string, emoji: string, userId: string) => {
      try {
        const { error } = await supabase
          .from('message_reactions')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', userId)
          .eq('emoji', emoji);

        if (error) throw error;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove reaction';
        console.error('❌ Error removing reaction:', err);
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
    addReaction,
    removeReaction,
  };
};

