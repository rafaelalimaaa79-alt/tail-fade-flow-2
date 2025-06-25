
-- Create comments table for the Smack Talk Board
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL, -- corresponds to bettor ID, trend ID, etc.
  user_id UUID REFERENCES auth.users NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 250),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment_likes table for tracking likes
CREATE TABLE public.comment_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id) -- Ensure user can only like a comment once
);

-- Add indexes for better performance
CREATE INDEX idx_comments_item_id ON public.comments(item_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at);
CREATE INDEX idx_comment_likes_comment_id ON public.comment_likes(comment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for comments
CREATE POLICY "Anyone can view comments" 
  ON public.comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON public.comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON public.comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for comment_likes
CREATE POLICY "Anyone can view comment likes" 
  ON public.comment_likes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create likes" 
  ON public.comment_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
  ON public.comment_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a function to get comments with like counts and user like status
CREATE OR REPLACE FUNCTION get_comments_with_likes(target_item_id TEXT, requesting_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  item_id TEXT,
  user_id UUID,
  username TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  likes_count BIGINT,
  user_has_liked BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.item_id,
    c.user_id,
    c.username,
    c.content,
    c.created_at,
    COALESCE(l.likes_count, 0) as likes_count,
    CASE 
      WHEN requesting_user_id IS NULL THEN false
      ELSE COALESCE(ul.user_has_liked, false)
    END as user_has_liked
  FROM public.comments c
  LEFT JOIN (
    SELECT comment_id, COUNT(*) as likes_count
    FROM public.comment_likes
    GROUP BY comment_id
  ) l ON c.id = l.comment_id
  LEFT JOIN (
    SELECT comment_id, true as user_has_liked
    FROM public.comment_likes
    WHERE user_id = requesting_user_id
  ) ul ON c.id = ul.comment_id
  WHERE c.item_id = target_item_id
  ORDER BY COALESCE(l.likes_count, 0) DESC, c.created_at DESC;
END;
$$;
