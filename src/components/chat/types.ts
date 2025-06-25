
export interface Comment {
  id: string;
  item_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  likes_count: number;
  user_has_liked: boolean;
}

export interface InlineSmackTalkProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle?: string;
}
