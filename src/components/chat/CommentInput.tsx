
import React from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CommentInputProps {
  newComment: string;
  setNewComment: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  currentUser: any;
}

const CommentInput = ({ 
  newComment, 
  setNewComment, 
  onSubmit, 
  isSubmitting, 
  currentUser 
}: CommentInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="border-t border-[#AEE3F5]/20 p-3 bg-black rounded-b-xl">
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
          onClick={onSubmit}
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
  );
};

export default CommentInput;
