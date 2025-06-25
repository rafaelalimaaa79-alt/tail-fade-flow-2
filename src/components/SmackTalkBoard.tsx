
import React, { useState, useEffect } from "react";
import { Heart, Send } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

interface SmackTalkBoardProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle?: string;
}

const SmackTalkBoard = ({ isOpen, onClose, itemId, itemTitle }: SmackTalkBoardProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
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
      // Get user profile for username
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
        // Remove like
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', currentUser.id);

        if (error) throw error;
      } else {
        // Add like
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
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-gray-900 border-gray-800">
        <SheetHeader className="border-b border-gray-800 pb-4">
          <SheetTitle className="text-white text-xl font-bold">
            Smack Talk 💬
          </SheetTitle>
          {itemTitle && (
            <p className="text-gray-300 text-sm font-medium mt-2">
              {itemTitle}
            </p>
          )}
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-400 py-8">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-lg">No one's talking… yet.</p>
                <p className="text-sm mt-2">Drop the first chirp.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#AEE3F5] font-semibold text-sm">
                        @{comment.username}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleLikeComment(comment.id, comment.user_has_liked)}
                      className={cn(
                        "flex items-center space-x-1 px-2 py-1 rounded-full transition-colors",
                        comment.user_has_liked
                          ? "text-red-400 bg-red-400/10"
                          : "text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          comment.user_has_liked && "fill-current"
                        )}
                      />
                      <span className="text-xs">{comment.likes_count}</span>
                    </button>
                  </div>
                  <p className="text-white text-sm">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Input Section */}
          <div className="border-t border-gray-800 pt-4 mt-4">
            <div className="flex space-x-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Got something to say?"
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none"
                rows={2}
                maxLength={250}
                disabled={isSubmitting}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="bg-[#AEE3F5] hover:bg-[#AEE3F5]/80 text-gray-900 px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {newComment.length}/250 characters
              </span>
              {!currentUser && (
                <span className="text-xs text-gray-400">
                  Sign in to post comments
                </span>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SmackTalkBoard;
