-- Create message_reactions table for storing emoji reactions on messages
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji) -- Ensure user can only add each emoji once per message
);

-- Create indexes for better performance
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON public.message_reactions(user_id);
CREATE INDEX idx_message_reactions_emoji ON public.message_reactions(emoji);

-- Enable Row Level Security (RLS)
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for message_reactions
CREATE POLICY "Anyone can view message reactions" 
  ON public.message_reactions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can add reactions" 
  ON public.message_reactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" 
  ON public.message_reactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable realtime for message_reactions table
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;

-- Add message_reactions to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;

