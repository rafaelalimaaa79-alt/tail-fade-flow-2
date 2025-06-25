
import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Comment } from "./types";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string, isCurrentlyLiked: boolean) => void;
}

const CommentItem = ({ comment, onLike }: CommentItemProps) => {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - commentTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="flex items-start gap-3 text-sm">
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
        onClick={() => onLike(comment.id, comment.user_has_liked)}
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
  );
};

export default CommentItem;
