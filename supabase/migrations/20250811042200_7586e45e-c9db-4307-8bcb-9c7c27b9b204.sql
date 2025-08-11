-- Enable realtime for comments table
ALTER TABLE public.comments REPLICA IDENTITY FULL;

-- Add comments to realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.comments;

-- Create function to get comments with likes if it doesn't exist
CREATE OR REPLACE FUNCTION get_comments_with_likes(target_item_id text, requesting_user_id uuid DEFAULT NULL)
RETURNS TABLE (
    id uuid,
    item_id text,
    user_id uuid,
    username text,
    content text,
    created_at timestamp with time zone,
    likes_count bigint,
    user_has_liked boolean
) AS $$
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
        SELECT 
            comment_id, 
            COUNT(*) as likes_count
        FROM public.comment_likes
        GROUP BY comment_id
    ) l ON c.id = l.comment_id
    LEFT JOIN (
        SELECT 
            comment_id,
            true as user_has_liked
        FROM public.comment_likes
        WHERE user_id = requesting_user_id
    ) ul ON c.id = ul.comment_id
    WHERE c.item_id = target_item_id
    ORDER BY c.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;