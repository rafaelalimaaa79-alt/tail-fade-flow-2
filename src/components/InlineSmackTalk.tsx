import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ChatHeader from "./chat/ChatHeader";
import CommentsList from "./chat/CommentsList";
import CommentInput from "./chat/CommentInput";
import { Comment, InlineSmackTalkProps } from "./chat/types";

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

  if (!isOpen) return null;

  return (
    <div className="bg-black border-l border-r border-b border-[#AEE3F5] overflow-hidden animate-in slide-in-from-top-4 duration-300 h-80 flex flex-col">
      <ChatHeader itemTitle={itemTitle} onClose={onClose} />
      
      <CommentsList 
        comments={comments}
        isLoading={isLoading}
        onLikeComment={handleLikeComment}
      />

      <CommentInput
        newComment={newComment}
        setNewComment={setNewComment}
        onSubmit={handleSubmitComment}
        isSubmitting={isSubmitting}
        currentUser={currentUser}
      />
    </div>
  );
};

export default InlineSmackTalk;
