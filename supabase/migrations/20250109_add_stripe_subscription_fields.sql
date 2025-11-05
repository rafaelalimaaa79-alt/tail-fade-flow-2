-- Add Stripe customer and subscription ID columns to user_profiles table
-- This migration adds fields to link user profiles with Stripe subscriptions

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer_id ON public.user_profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_subscription_id ON public.user_profiles(stripe_subscription_id);

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.stripe_customer_id IS 'Stripe customer ID for this user';
COMMENT ON COLUMN public.user_profiles.stripe_subscription_id IS 'Stripe subscription ID for this user';
COMMENT ON COLUMN public.user_profiles.subscription_current_period_start IS 'Start date of current subscription billing period';
COMMENT ON COLUMN public.user_profiles.subscription_current_period_end IS 'End date of current subscription billing period';

