
import React, { useState, useEffect } from "react";
import { Heart, Send, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  item_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  likes_count: number;
  user_has_liked: boolean;
}

interface InlineSmackTalkProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle?: string;
}

const InlineSmackTalk = ({ isOpen, onClose, itemId, itemTitle }: InlineSmackTalkProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (isOpen && itemId) {
      loadComments();
    }
  }, [isOpen, itemId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_comments_with_likes', {
        target_item_id: itemId,
        requesting_user_id: currentUser?.id || null
      });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post comments",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('id', currentUser.id)
        .single();

      const username = profile?.username || currentUser.email || 'Anonymous';

      const { error } = await supabase
        .from('comments')
        .insert({
          item_id: itemId,
          user_id: currentUser.id,
          username: username,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment("");
      await loadComments();
      
      toast({
        title: "Comment posted!",
        description: "Your comment has been added to the discussion",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string, isCurrentlyLiked: boolean) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like comments",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isCurrentlyLiked) {
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', currentUser.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: currentUser.id
          });

        if (error) throw error;
      }

      await loadComments();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - commentTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black border-l border-r border-b border-[#AEE3F5] rounded-b-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#AEE3F5]/20 bg-black">
        <div className="flex items-center gap-2">
          <div className="text-sm">💬</div>
          <div className="text-[#AEE3F5] font-medium text-sm">Chat</div>
          {itemTitle && (
            <div className="text-[#AEE3F5]/60 text-xs">• {itemTitle}</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#AEE3F5]/60 hover:text-[#AEE3F5] transition-colors p-1 rounded-md hover:bg-[#AEE3F5]/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Comments Section */}
      <div className="max-h-64 overflow-y-auto px-4 py-3 bg-black">
        {isLoading ? (
          <div className="text-center text-[#AEE3F5]/60 py-6">
            <div className="text-sm">Loading comments...</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-[#AEE3F5]/60 py-6">
            <div className="text-sm font-medium">No comments yet</div>
            <div className="text-xs mt-1 opacity-80">Be the first to comment</div>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[#AEE3F5] font-bold text-sm">
                      @{comment.username}
                    </span>
                    <span className="text-[#AEE3F5]/40 text-xs">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <div className="text-[#AEE3F5] mt-0.5 leading-relaxed">
                    {comment.content}
                  </div>
                </div>
                
                {/* Like Button */}
                <button
                  onClick={() => handleLikeComment(comment.id, comment.user_has_liked)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full transition-colors text-xs flex-shrink-0",
                    comment.user_has_liked
                      ? "text-red-400 bg-red-400/10"
                      : "text-[#AEE3F5]/60 hover:text-red-400 hover:bg-red-400/10"
                  )}
                >
                  <Heart
                    className={cn(
                      "h-3.5 w-3.5",
                      comment.user_has_liked && "fill-current"
                    )}
                  />
                  {comment.likes_count > 0 && (
                    <span>{comment.likes_count}</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="border-t border-[#AEE3F5]/20 p-3 bg-black">
        <div className="flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment..."
            className="flex-1 bg-black border-[#AEE3F5]/30 text-[#AEE3F5] placeholder-[#AEE3F5]/50 resize-none min-h-[36px] max-h-[80px] text-sm focus:border-[#AEE3F5]/60"
            rows={1}
            maxLength={250}
            disabled={isSubmitting}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
            className="bg-[#AEE3F5] hover:bg-[#AEE3F5]/80 text-black px-3 self-end h-9"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-[#AEE3F5]/40">
            {newComment.length}/250
          </span>
          {!currentUser && (
            <span className="text-xs text-[#AEE3F5]/60">
              Sign in to comment
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InlineSmackTalk;
