-- ============================================================================
-- DYNAMIC ONBOARDING QUESTIONS - SUPABASE SETUP (CLEAN START)
-- ============================================================================
-- Run this SQL directly in your Supabase dashboard (SQL Editor)
-- This completely removes and recreates all onboarding tables with 24 questions

-- ============================================================================
-- STEP 1: DROP EXISTING TABLES AND POLICIES (if they exist)
-- ============================================================================
DROP TABLE IF EXISTS public.user_onboarding_answers CASCADE;
DROP TABLE IF EXISTS public.onboarding_question_options CASCADE;
DROP TABLE IF EXISTS public.onboarding_questions CASCADE;

-- ============================================================================
-- STEP 2: CREATE TABLE 1: onboarding_questions
-- ============================================================================
CREATE TABLE public.onboarding_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_number INT NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'text_response', 'info_screen')),
  subtext TEXT,
  cta_button_text TEXT,
  cta_button_route TEXT,
  is_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- STEP 3: CREATE TABLE 2: onboarding_question_options
-- ============================================================================
CREATE TABLE public.onboarding_question_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.onboarding_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_value TEXT NOT NULL,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- STEP 4: CREATE TABLE 3: user_onboarding_answers
-- ============================================================================
CREATE TABLE public.user_onboarding_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.onboarding_questions(id) ON DELETE CASCADE,
  answer_value TEXT NOT NULL,
  answer_type TEXT NOT NULL CHECK (answer_type IN ('option_selected', 'text_entered', 'skipped')),
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- ============================================================================
-- STEP 5: CREATE INDEXES
-- ============================================================================
CREATE INDEX idx_onboarding_questions_step ON public.onboarding_questions(step_number);
CREATE INDEX idx_question_options_question_id ON public.onboarding_question_options(question_id);
CREATE INDEX idx_user_answers_user_id ON public.user_onboarding_answers(user_id);
CREATE INDEX idx_user_answers_question_id ON public.user_onboarding_answers(question_id);
CREATE INDEX idx_user_answers_answered_at ON public.user_onboarding_answers(answered_at);

-- ============================================================================
-- STEP 6: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.onboarding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding_answers ENABLE ROW LEVEL SECURITY;

-- Questions and options are public (everyone can read)
CREATE POLICY "Questions are public" ON public.onboarding_questions FOR SELECT USING (true);
CREATE POLICY "Question options are public" ON public.onboarding_question_options FOR SELECT USING (true);

-- Users can only see their own answers
CREATE POLICY "Users can view their own answers" ON public.user_onboarding_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own answers" ON public.user_onboarding_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own answers" ON public.user_onboarding_answers FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 7: SEED DATA - 24 ONBOARDING QUESTIONS
-- ============================================================================

-- ============================================================================
-- SEED DATA: 23 ONBOARDING QUESTIONS
-- ============================================================================

-- Step 1: How did you hear about NoShot?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (1, 'How did you hear about NoShot?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'TikTok', 'tiktok', 1 FROM public.onboarding_questions WHERE step_number = 1
UNION ALL
SELECT id, 'Instagram', 'instagram', 2 FROM public.onboarding_questions WHERE step_number = 1
UNION ALL
SELECT id, 'Friend referral', 'friend_referral', 3 FROM public.onboarding_questions WHERE step_number = 1
UNION ALL
SELECT id, 'Twitter/X', 'twitter_x', 4 FROM public.onboarding_questions WHERE step_number = 1
UNION ALL
SELECT id, 'Podcast/YouTube', 'podcast_youtube', 5 FROM public.onboarding_questions WHERE step_number = 1
UNION ALL
SELECT id, 'Other', 'other', 6 FROM public.onboarding_questions WHERE step_number = 1;

-- Step 2: How big do you usually go on a single bet?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (2, 'How big do you usually go on a single bet?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, '$10', '10', 1 FROM public.onboarding_questions WHERE step_number = 2
UNION ALL
SELECT id, '$25', '25', 2 FROM public.onboarding_questions WHERE step_number = 2
UNION ALL
SELECT id, '$50', '50', 3 FROM public.onboarding_questions WHERE step_number = 2
UNION ALL
SELECT id, '$100', '100', 4 FROM public.onboarding_questions WHERE step_number = 2
UNION ALL
SELECT id, '$200+', '200_plus', 5 FROM public.onboarding_questions WHERE step_number = 2;

-- Step 3: How often are you firing bets?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (3, 'How often are you firing bets?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Daily', 'daily', 1 FROM public.onboarding_questions WHERE step_number = 3
UNION ALL
SELECT id, 'Weekends', 'weekends', 2 FROM public.onboarding_questions WHERE step_number = 3
UNION ALL
SELECT id, 'Only big games', 'only_big_games', 3 FROM public.onboarding_questions WHERE step_number = 3
UNION ALL
SELECT id, 'Rarely', 'rarely', 4 FROM public.onboarding_questions WHERE step_number = 3;

-- Step 4: When you bet, what's the goal?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (4, 'When you bet, what''s the goal?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Fun', 'fun', 1 FROM public.onboarding_questions WHERE step_number = 4
UNION ALL
SELECT id, 'Profit', 'profit', 2 FROM public.onboarding_questions WHERE step_number = 4
UNION ALL
SELECT id, 'Bragging rights', 'bragging_rights', 3 FROM public.onboarding_questions WHERE step_number = 4
UNION ALL
SELECT id, 'All of it', 'all_of_it', 4 FROM public.onboarding_questions WHERE step_number = 4;

-- Step 5: What's the biggest bet you've ever won? (Text response)
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (5, 'What''s the biggest bet you''ve ever won?', 'text_response', false);

-- Step 6: What's the biggest bet you've ever lost? (Text response)
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (6, 'What''s the biggest bet you''ve ever lost?', 'text_response', false);

-- Step 7: You ever fade your buddy's "lock of the week"?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (7, 'You ever fade your buddy''s "lock of the week"?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Yeah, too many times', 'yeah_too_many', 1 FROM public.onboarding_questions WHERE step_number = 7
UNION ALL
SELECT id, 'Sometimes', 'sometimes', 2 FROM public.onboarding_questions WHERE step_number = 7
UNION ALL
SELECT id, 'Never', 'never', 3 FROM public.onboarding_questions WHERE step_number = 7;

-- Step 8: You trust your gut more than the numbers?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (8, 'You trust your gut more than the numbers?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Always', 'always', 1 FROM public.onboarding_questions WHERE step_number = 8
UNION ALL
SELECT id, 'Mix of both', 'mix_of_both', 2 FROM public.onboarding_questions WHERE step_number = 8
UNION ALL
SELECT id, 'Numbers don''t lie', 'numbers_dont_lie', 3 FROM public.onboarding_questions WHERE step_number = 8;

-- Step 9: How many times have you been "one leg away"?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (9, 'How many times have you been "one leg away"?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Too many', 'too_many', 1 FROM public.onboarding_questions WHERE step_number = 9
UNION ALL
SELECT id, 'Sometimes', 'sometimes', 2 FROM public.onboarding_questions WHERE step_number = 9
UNION ALL
SELECT id, 'Never', 'never', 3 FROM public.onboarding_questions WHERE step_number = 9;

-- Step 10: What's your go-to move after a bad loss?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (10, 'What''s your go-to move after a bad loss?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Chase', 'chase', 1 FROM public.onboarding_questions WHERE step_number = 10
UNION ALL
SELECT id, 'Log off', 'log_off', 2 FROM public.onboarding_questions WHERE step_number = 10
UNION ALL
SELECT id, 'Blame the refs', 'blame_refs', 3 FROM public.onboarding_questions WHERE step_number = 10;

-- Step 11: Be real — what's your weekly balance usually look like?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (11, 'Be real — what''s your weekly balance usually look like?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Up', 'up', 1 FROM public.onboarding_questions WHERE step_number = 11
UNION ALL
SELECT id, 'Even', 'even', 2 FROM public.onboarding_questions WHERE step_number = 11
UNION ALL
SELECT id, 'Down bad', 'down_bad', 3 FROM public.onboarding_questions WHERE step_number = 11;

-- Step 12: You ever go on a heater and give it all back?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (12, 'You ever go on a heater and give it all back?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Yep', 'yep', 1 FROM public.onboarding_questions WHERE step_number = 12
UNION ALL
SELECT id, 'Happens', 'happens', 2 FROM public.onboarding_questions WHERE step_number = 12
UNION ALL
SELECT id, 'Never', 'never', 3 FROM public.onboarding_questions WHERE step_number = 12;

-- Step 13: You think more people win or lose long-term?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (13, 'You think more people win or lose long-term?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Win', 'win', 1 FROM public.onboarding_questions WHERE step_number = 13
UNION ALL
SELECT id, 'Lose', 'lose', 2 FROM public.onboarding_questions WHERE step_number = 13
UNION ALL
SELECT id, 'Don''t know', 'dont_know', 3 FROM public.onboarding_questions WHERE step_number = 13;

-- Step 14: If 98% lose long term… what's smarter?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (14, 'If 98% lose long term… what''s smarter?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Try to be the 2%', 'be_2_percent', 1 FROM public.onboarding_questions WHERE step_number = 14
UNION ALL
SELECT id, 'Bet against the 98%', 'bet_against_98', 2 FROM public.onboarding_questions WHERE step_number = 14;

-- Step 15: Who loses you more money — your gut or your friends?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (15, 'Who loses you more money — your gut or your friends?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'My gut', 'my_gut', 1 FROM public.onboarding_questions WHERE step_number = 15
UNION ALL
SELECT id, 'My friends', 'my_friends', 2 FROM public.onboarding_questions WHERE step_number = 15
UNION ALL
SELECT id, 'Both equally', 'both_equally', 3 FROM public.onboarding_questions WHERE step_number = 15;

-- Step 16: You ever see a pick everyone's on… and it still loses?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (16, 'You ever see a pick everyone''s on… and it still loses?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'All the time', 'all_the_time', 1 FROM public.onboarding_questions WHERE step_number = 16
UNION ALL
SELECT id, 'Sometimes', 'sometimes', 2 FROM public.onboarding_questions WHERE step_number = 16
UNION ALL
SELECT id, 'Rarely', 'rarely', 3 FROM public.onboarding_questions WHERE step_number = 16;

-- Step 17: Why do you think the public always loses?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (17, 'Why do you think the public always loses?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Public bias', 'public_bias', 1 FROM public.onboarding_questions WHERE step_number = 17
UNION ALL
SELECT id, 'Luck', 'luck', 2 FROM public.onboarding_questions WHERE step_number = 17
UNION ALL
SELECT id, 'Scripted', 'scripted', 3 FROM public.onboarding_questions WHERE step_number = 17;

-- Step 18: What's more valuable — predicting winners or spotting losers?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (18, 'What''s more valuable — predicting winners or spotting losers?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Predicting winners', 'predicting_winners', 1 FROM public.onboarding_questions WHERE step_number = 18
UNION ALL
SELECT id, 'Spotting losers', 'spotting_losers', 2 FROM public.onboarding_questions WHERE step_number = 18;

-- Step 19: You ever wish you could track who's cold before betting?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (19, 'You ever wish you could track who''s cold before betting?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Yes', 'yes', 1 FROM public.onboarding_questions WHERE step_number = 19
UNION ALL
SELECT id, 'Absolutely', 'absolutely', 2 FROM public.onboarding_questions WHERE step_number = 19
UNION ALL
SELECT id, 'Nah', 'nah', 3 FROM public.onboarding_questions WHERE step_number = 19;

-- Step 20: Imagine seeing every bettor who's on a cold streak. You in?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (20, 'Imagine seeing every bettor who''s on a cold streak. You in?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Hell yes', 'hell_yes', 1 FROM public.onboarding_questions WHERE step_number = 20
UNION ALL
SELECT id, 'Maybe', 'maybe', 2 FROM public.onboarding_questions WHERE step_number = 20
UNION ALL
SELECT id, 'No shot', 'no_shot', 3 FROM public.onboarding_questions WHERE step_number = 20;

-- Step 21: You think you'd be the one fading… or getting faded?
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (21, 'You think you''d be the one fading… or getting faded?', 'multiple_choice', true);

INSERT INTO public.onboarding_question_options (question_id, option_text, option_value, display_order)
SELECT id, 'Fader', 'fader', 1 FROM public.onboarding_questions WHERE step_number = 21
UNION ALL
SELECT id, 'Fade', 'fade', 2 FROM public.onboarding_questions WHERE step_number = 21
UNION ALL
SELECT id, 'Not sure', 'not_sure', 3 FROM public.onboarding_questions WHERE step_number = 21;

-- Step 22: Info screen with CTA
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, subtext, cta_button_text, cta_button_route, is_required)
VALUES (22, 'You can''t beat the books. But you can beat the bettors.', 'info_screen', 'Ready to see who''s ice cold this week?', 'Show Me the Fades', '/onboarding?step=23', true);

-- Step 23: Set username
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (23, 'Create your username', 'text_response', true);

-- Step 24: Paywall screen (optional)
INSERT INTO public.onboarding_questions (step_number, question_text, question_type, is_required)
VALUES (24, 'Paywall Screen', 'info_screen', false);

