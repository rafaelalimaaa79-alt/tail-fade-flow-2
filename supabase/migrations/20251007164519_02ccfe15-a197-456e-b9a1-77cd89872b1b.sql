-- Enable realtime for bets table
ALTER TABLE public.bets REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bets;