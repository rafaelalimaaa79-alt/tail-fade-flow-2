-- Create public_bets table for manually entered public betting data
CREATE TABLE IF NOT EXISTS public.public_bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_name TEXT NOT NULL,
  team_public_is_on TEXT NOT NULL,
  public_percentage INTEGER NOT NULL CHECK (public_percentage >= 0 AND public_percentage <= 100),
  spread TEXT,
  sport TEXT NOT NULL,
  game_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_public_bets_status ON public.public_bets(status);
CREATE INDEX IF NOT EXISTS idx_public_bets_public_percentage ON public.public_bets(public_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_public_bets_game_date ON public.public_bets(game_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.public_bets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read public bets (needed for public page)
CREATE POLICY "Allow public read access to public_bets"
  ON public.public_bets
  FOR SELECT
  USING (true);

-- Only allow authenticated users with admin role to insert
CREATE POLICY "Allow admin to insert public_bets"
  ON public.public_bets
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Only allow authenticated users with admin role to update
CREATE POLICY "Allow admin to update public_bets"
  ON public.public_bets
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Only allow authenticated users with admin role to delete
CREATE POLICY "Allow admin to delete public_bets"
  ON public.public_bets
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Add comments for documentation
COMMENT ON TABLE public.public_bets IS 'Manually entered public betting percentages for display on Public page';
COMMENT ON COLUMN public.public_bets.game_name IS 'Full game name, e.g., "Las Vegas Raiders @ Denver Broncos"';
COMMENT ON COLUMN public.public_bets.team_public_is_on IS 'Team name that the public is betting on';
COMMENT ON COLUMN public.public_bets.public_percentage IS 'Public betting percentage (0-100)';
COMMENT ON COLUMN public.public_bets.spread IS 'Spread line (e.g., "-3.5", "+7", or empty for moneyline/total)';
COMMENT ON COLUMN public.public_bets.status IS 'Status filter: active or inactive';

