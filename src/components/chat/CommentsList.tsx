
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentItem from "./CommentItem";
import { Comment } from "./types";

interface CommentsListProps {
  comments: Comment[];
  isLoading: boolean;
  onLikeComment: (commentId: string, isCurrentlyLiked: boolean) => void;
}

const CommentsList = ({ comments, isLoading, onLikeComment }: CommentsListProps) => {
  if (isLoading) {
    return (
      <ScrollArea className="flex-1 px-4 py-3 bg-black">
        <div className="text-center text-[#AEE3F5]/60 py-6">
          <div className="text-sm">Loading comments...</div>
        </div>
      </ScrollArea>
    );
  }

  if (comments.length === 0) {
    return (
      <ScrollArea className="flex-1 px-4 py-3 bg-black">
        <div className="text-center text-[#AEE3F5]/60 py-6">
          <div className="text-sm font-medium">No comments yet</div>
          <div className="text-xs mt-1 opacity-80">Be the first to comment</div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4 py-3 bg-black">
      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={onLikeComment}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default CommentsList;
