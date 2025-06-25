
-- Fix the ambiguous user_id reference in get_comments_with_likes function
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
    WHERE comment_likes.user_id = requesting_user_id
  ) ul ON c.id = ul.comment_id
  WHERE c.item_id = target_item_id
  ORDER BY COALESCE(l.likes_count, 0) DESC, c.created_at DESC;
END;
$$;
