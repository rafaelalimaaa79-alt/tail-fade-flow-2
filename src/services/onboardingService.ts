import { supabase } from '@/integrations/supabase/client';

/**
 * Save onboarding answers to user_profiles
 * Each step saves its answer to the corresponding column
 */

export interface OnboardingAnswers {
  referral_source?: string;
  leagues?: string[];
  birthday?: { month: string; day: string; year: string };
  name?: string;
  experience?: string;
  bankroll?: string;
  quiz_answer?: string;
  sportsbooks?: string[];
}

/**
 * Format birthday object to string
 */
function formatBirthday(birthday: { month: string; day: string; year: string }): string {
  if (!birthday.month || !birthday.day || !birthday.year) {
    return '';
  }
  // Format as YYYY-MM-DD
  return `${birthday.year}-${birthday.month.padStart(2, '0')}-${birthday.day.padStart(2, '0')}`;
}

/**
 * Format array to comma-separated string
 */
function formatArray(arr: string[]): string {
  return arr.join(',');
}

/**
 * Save Step 1: Referral Source
 */
export async function saveReferralSource(userId: string, referralSource: string) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ onboarding_referral_source: referralSource, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error saving referral source:', error);
    throw error;
  }
}

/**
 * Save Step 2: Leagues
 */
export async function saveLeagues(userId: string, leagues: string[]) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ onboarding_leagues: formatArray(leagues), updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error saving leagues:', error);
    throw error;
  }
}

/**
 * Save Step 3: Birthday
 */
export async function saveBirthday(userId: string, birthday: { month: string; day: string; year: string }) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ onboarding_birthday: formatBirthday(birthday), updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error saving birthday:', error);
    throw error;
  }
}

/**
 * Save Step 4: Name
 */
export async function saveName(userId: string, name: string) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ onboarding_name: name, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error saving name:', error);
    throw error;
  }
}

/**
 * Save Step 5: Experience
 */
export async function saveExperience(userId: string, experience: string) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ onboarding_experience: experience, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error saving experience:', error);
    throw error;
  }
}

/**
 * Save Step 6: Bankroll
 */
export async function saveBankroll(userId: string, bankroll: string) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ onboarding_bankroll: bankroll, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error saving bankroll:', error);
    throw error;
  }
}

/**
 * Save Step 7: Quiz Answer
 */
export async function saveQuizAnswer(userId: string, quizAnswer: string) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ onboarding_quiz_answer: quizAnswer, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error saving quiz answer:', error);
    throw error;
  }
}

/**
 * Save Step 8: Sportsbooks
 */
export async function saveSportsbooks(userId: string, sportsbooks: string[]) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ onboarding_sportsbooks: formatArray(sportsbooks), updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error saving sportsbooks:', error);
    throw error;
  }
}

/**
 * Save all onboarding answers at once
 */
export async function saveAllOnboardingAnswers(userId: string, answers: OnboardingAnswers) {
  const updateData: any = { updated_at: new Date().toISOString() };

  if (answers.referral_source) updateData.onboarding_referral_source = answers.referral_source;
  if (answers.leagues) updateData.onboarding_leagues = formatArray(answers.leagues);
  if (answers.birthday) updateData.onboarding_birthday = formatBirthday(answers.birthday);
  if (answers.name) updateData.onboarding_name = answers.name;
  if (answers.experience) updateData.onboarding_experience = answers.experience;
  if (answers.bankroll) updateData.onboarding_bankroll = answers.bankroll;
  if (answers.quiz_answer) updateData.onboarding_quiz_answer = answers.quiz_answer;
  if (answers.sportsbooks) updateData.onboarding_sportsbooks = formatArray(answers.sportsbooks);

  const { error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('Error saving onboarding answers:', error);
    throw error;
  }
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(userId: string) {
  const { error } = await supabase
    .from('user_profiles')
    .update({
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error marking onboarding complete:', error);
    throw error;
  }
}

/**
 * Get all onboarding answers for a user
 */
export async function getOnboardingAnswers(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(
      'onboarding_referral_source, onboarding_leagues, onboarding_birthday, onboarding_name, onboarding_experience, onboarding_bankroll, onboarding_quiz_answer, onboarding_sportsbooks, onboarding_completed_at'
    )
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching onboarding answers:', error);
    throw error;
  }

  return data;
}

/**
 * Check if onboarding is completed
 */
export async function isOnboardingCompleted(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('onboarding_completed_at')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking onboarding status:', error);
    throw error;
  }

  return !!data?.onboarding_completed_at;
}

/**
 * Reset onboarding (delete all answers and reset completion)
 */
export async function resetOnboarding(userId: string) {
  const { error } = await supabase
    .from('user_profiles')
    .update({
      onboarding_referral_source: null,
      onboarding_leagues: null,
      onboarding_birthday: null,
      onboarding_name: null,
      onboarding_experience: null,
      onboarding_bankroll: null,
      onboarding_quiz_answer: null,
      onboarding_sportsbooks: null,
      onboarding_completed_at: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error resetting onboarding:', error);
    throw error;
  }
}

