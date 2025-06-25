
import React from "react";
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
      <div className="max-h-64 overflow-y-auto px-4 py-3 bg-black">
        <div className="text-center text-[#AEE3F5]/60 py-6">
          <div className="text-sm">Loading comments...</div>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="max-h-64 overflow-y-auto px-4 py-3 bg-black">
        <div className="text-center text-[#AEE3F5]/60 py-6">
          <div className="text-sm font-medium">No comments yet</div>
          <div className="text-xs mt-1 opacity-80">Be the first to comment</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto px-4 py-3 bg-black">
      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={onLikeComment}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
