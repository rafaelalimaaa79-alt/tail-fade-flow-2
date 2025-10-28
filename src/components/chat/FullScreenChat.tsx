import React, { useState, useEffect, useRef } from "react";
import { Send, Smile, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMessagesRealtime } from "@/hooks/useMessagesRealtime";
import { useAuth } from "@/contexts/AuthContext";
import { useMessagesRealtime } from "@/hooks/useMessagesRealtime";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FullScreenChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenChat = ({ isOpen, onClose }: FullScreenChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [suggestedUsers, setSuggestedUsers] = useState<string[]>([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Get current user from AuthContext
  const { user, loading: authLoading } = useAuth();

  // Use the realtime messages hook
  const { messages, isLoading, sendMessage } = useMessagesRealtime();

  // Get current user from AuthContext
  const { user, loading: authLoading } = useAuth();

  // Use the realtime messages hook
  const { messages, isLoading, sendMessage } = useMessagesRealtime();

  const emojis = ["👍", "❤️", "😂", "😢", "😡", "🔥", "💯", "🎯", "⚡", "💪"];

  useEffect(() => {
    if (isOpen) {
      // Restore scroll position
      setTimeout(() => {
        if (scrollAreaRef.current && scrollPosition > 0) {
          scrollAreaRef.current.scrollTop = scrollPosition;
        } else {
          scrollToBottom();
        }
      }, 100);
    }
  }, [isOpen, messages]);

  // Save scroll position when closing
  useEffect(() => {
    if (!isOpen && scrollAreaRef.current) {
      setScrollPosition(scrollAreaRef.current.scrollTop);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSubmitMessage = async () => {
    if (!user || authLoading || !newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await sendMessage(newMessage.trim(), user.id);
      setNewMessage("");
      setShowEmojiPicker(false);
      scrollToBottom();
    } catch (error) {
      console.error('Error posting message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleAtMention = async (text: string) => {
    const lastAtIndex = text.lastIndexOf('@');
    if (lastAtIndex === -1 || lastAtIndex === text.length - 1) {
      setShowUserSuggestions(false);
      return;
    }

    const searchTerm = text.slice(lastAtIndex + 1);
    if (searchTerm.length > 0) {
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('username')
          .ilike('username', `%${searchTerm}%`)
          .limit(5);
        
        setSuggestedUsers(data?.map(u => u.username) || []);
        setShowUserSuggestions(true);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    } else {
      setShowUserSuggestions(false);
    }
  };

  const insertMention = (username: string) => {
    const lastAtIndex = newMessage.lastIndexOf('@');
    const beforeAt = newMessage.slice(0, lastAtIndex);
    setNewMessage(`${beforeAt}@${username} `);
    setShowUserSuggestions(false);
    inputRef.current?.focus();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const formatMessageContent = (content: string) => {
    // Simple @mention highlighting
    return content.replace(/@(\w+)/g, '<span class="text-[#AEE3F5] font-semibold">@$1</span>');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .no-scroll-textarea {
          overflow: hidden !important;
          resize: none !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .no-scroll-textarea::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
      <div 
        className={cn(
          "bg-black border border-[#AEE3F5]/30 rounded-3xl flex flex-col max-w-md w-full h-[85vh] max-h-[600px]",
          "animate-in slide-in-from-bottom-full duration-300 shadow-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center justify-center p-4 border-b border-[#AEE3F5]/20">
          <div className="flex items-center gap-3 mb-1">
            <Users className="text-[#AEE3F5] h-5 w-5" />
            <h1 className="text-[#AEE3F5] font-semibold text-lg">NoShot Message Boards</h1>
            <Users className="text-[#AEE3F5] h-5 w-5" />
          </div>
          <p className="text-[#AEE3F5]/60 text-xs">Public chat for all users</p>
        </div>

        {/* Messages */}
        <div 
          ref={scrollAreaRef}
          className="flex-1 px-4 py-3 overflow-y-auto hide-scrollbar"
        >
        {isLoading ? (
          <div className="text-center text-[#AEE3F5]/60 py-8">
            <div className="text-sm">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-[#AEE3F5]/60 py-8">
            <div className="text-sm font-medium">Welcome to the chat!</div>
            <div className="text-xs mt-1 opacity-80">Start the conversation</div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => {
              const previousMessage = index > 0 ? messages[index - 1] : null;
              const isSameUserAsPrevious = previousMessage?.user_id === message.user_id;
              const isCurrentUser = message.user_id === user?.id;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-1",
                    isCurrentUser ? "items-end" : "items-start"
                  )}
                >
                  {!isSameUserAsPrevious && (
                    <div className={cn(
                      "flex items-baseline gap-2",
                      isCurrentUser && "flex-row-reverse"
                    )}>
                      <span className="text-[#AEE3F5] font-semibold text-sm">
                        @{message.username}
                      </span>
                      <span className="text-[#AEE3F5]/40 text-xs">
                        {formatTimeAgo(message.created_at)}
                      </span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "text-[#AEE3F5] text-sm leading-relaxed max-w-xs px-3 py-2 rounded-lg",
                      isCurrentUser
                        ? "bg-[#AEE3F5]/20 text-right"
                        : "bg-[#AEE3F5]/10"
                    )}
                    dangerouslySetInnerHTML={{
                      __html: formatMessageContent(message.content)
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
        </div>

        {/* User suggestions */}
        {showUserSuggestions && suggestedUsers.length > 0 && (
          <div className="mx-4 mb-2 bg-black border border-[#AEE3F5]/30 rounded-lg overflow-hidden">
          {suggestedUsers.map((username, index) => (
            <button
              key={index}
              onClick={() => insertMention(username)}
              className="w-full px-3 py-2 text-left text-[#AEE3F5] hover:bg-[#AEE3F5]/10 text-sm"
            >
              @{username}
            </button>
          ))}
          </div>
        )}

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="mx-4 mb-2 bg-black border border-[#AEE3F5]/30 rounded-lg p-3">
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="p-2 rounded-lg hover:bg-[#AEE3F5]/10 text-xl"
              >
                {emoji}
              </button>
            ))}
          </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-[#AEE3F5]/20 p-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleAtMention(e.target.value);
                // Auto-resize textarea
                if (inputRef.current) {
                  inputRef.current.style.height = 'auto';
                  inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 100) + 'px';
                }
              }}
              onKeyDown={handleKeyPress}
              placeholder="Enter Trash Talk Here"
              className="bg-black border-[#AEE3F5]/30 text-[#AEE3F5] placeholder-[#AEE3F5]/50 resize-none min-h-[40px] max-h-[100px] text-sm focus:border-[#AEE3F5]/60 pr-12 no-scroll-textarea"
              rows={1}
              maxLength={500}
              disabled={isSubmitting}
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-2 text-[#AEE3F5]/60 hover:text-[#AEE3F5] transition-colors"
            >
              <Smile className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={handleSubmitMessage}
            disabled={!newMessage.trim() || isSubmitting}
            className="bg-[#AEE3F5] hover:bg-[#AEE3F5]/80 text-black px-3 h-10 min-w-[44px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-[#AEE3F5]/40">
            {newMessage.length}/500
          </span>
          {authLoading ? (
            <span className="text-xs text-[#AEE3F5]/60">
              Loading...
            </span>
          ) : !user ? (
            <span className="text-xs text-[#AEE3F5]/60">
              Sign in to chat
            </span>
          ) : null}
        </div>
      </div>
    </div>
    </div>
  );
};

export default FullScreenChat;