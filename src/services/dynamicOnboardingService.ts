import { supabase } from "@/integrations/supabase/client";

export interface OnboardingQuestion {
  id: string;
  step_number: number;
  question_text: string;
  question_type: 'multiple_choice' | 'text_response' | 'info_screen';
  subtext: string | null;
  cta_button_text: string | null;
  cta_button_route: string | null;
  is_required: boolean;
}

export interface OnboardingOption {
  id: string;
  question_id: string;
  option_text: string;
  option_value: string;
  display_order: number;
}

export interface OnboardingAnswer {
  question_id: string;
  answer_value: string;
  answer_type: 'option_selected' | 'text_entered' | 'skipped';
}

const QUESTIONS_CACHE_KEY = 'onboarding_questions_cache';
const OPTIONS_CACHE_KEY = 'onboarding_options_cache';
const ANSWERS_STORAGE_KEY = 'onboarding_answers_local';
const CACHE_EXPIRY_KEY = 'onboarding_cache_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch all onboarding questions from Supabase
 * Uses caching to minimize database queries
 */
export async function fetchOnboardingQuestions(): Promise<OnboardingQuestion[]> {
  try {
    // Check cache first
    const cached = localStorage.getItem(QUESTIONS_CACHE_KEY);
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    
    if (cached && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
      console.log('Using cached onboarding questions');
      return JSON.parse(cached);
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('onboarding_questions')
      .select('*')
      .order('step_number', { ascending: true });

    if (error) throw error;

    // Cache the results
    localStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());

    return data as OnboardingQuestion[];
  } catch (error) {
    console.error('Error fetching onboarding questions:', error);
    throw error;
  }
}

/**
 * Fetch all options for onboarding questions
 * Uses caching to minimize database queries
 */
export async function fetchOnboardingOptions(): Promise<OnboardingOption[]> {
  try {
    // Check cache first
    const cached = localStorage.getItem(OPTIONS_CACHE_KEY);
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    
    if (cached && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
      console.log('Using cached onboarding options');
      return JSON.parse(cached);
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('onboarding_question_options')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    // Cache the results
    localStorage.setItem(OPTIONS_CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());

    return data as OnboardingOption[];
  } catch (error) {
    console.error('Error fetching onboarding options:', error);
    throw error;
  }
}

/**
 * Get local answers stored in localStorage
 */
export function getLocalAnswers(): Record<string, OnboardingAnswer> {
  try {
    const stored = localStorage.getItem(ANSWERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting local answers:', error);
    return {};
  }
}

/**
 * Save answer to localStorage (not to database yet)
 */
export function saveLocalAnswer(questionId: string, answer: OnboardingAnswer): void {
  try {
    const answers = getLocalAnswers();
    answers[questionId] = answer;
    localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    console.log('Answer saved locally:', { questionId, answer });
  } catch (error) {
    console.error('Error saving local answer:', error);
  }
}

/**
 * Get a specific local answer
 */
export function getLocalAnswer(questionId: string): OnboardingAnswer | null {
  const answers = getLocalAnswers();
  return answers[questionId] || null;
}

/**
 * Clear all local answers
 */
export function clearLocalAnswers(): void {
  localStorage.removeItem(ANSWERS_STORAGE_KEY);
  console.log('Local answers cleared');
}

/**
 * Save all answers to database (called on step 23 completion)
 */
export async function saveAnswersToDatabase(userId: string): Promise<void> {
  try {
    const answers = getLocalAnswers();
    
    if (Object.keys(answers).length === 0) {
      console.warn('No answers to save');
      return;
    }

    // Convert local answers to database format
    const answersToInsert = Object.entries(answers).map(([questionId, answer]) => ({
      user_id: userId,
      question_id: questionId,
      answer_value: answer.answer_value,
      answer_type: answer.answer_type,
      answered_at: new Date().toISOString()
    }));

    // Insert all answers
    const { error } = await supabase
      .from('user_onboarding_answers')
      .insert(answersToInsert);

    if (error) throw error;

    console.log('All answers saved to database successfully');
    clearLocalAnswers();
  } catch (error) {
    console.error('Error saving answers to database:', error);
    throw error;
  }
}

/**
 * Get answer for a specific question by step number
 */
export function getAnswerByStepNumber(
  questions: OnboardingQuestion[],
  stepNumber: number
): OnboardingAnswer | null {
  const question = questions.find(q => q.step_number === stepNumber);
  if (!question) return null;
  return getLocalAnswer(question.id);
}

