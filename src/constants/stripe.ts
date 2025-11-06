/**
 * Stripe Configuration and Constants
 * Contains Stripe product IDs, price IDs, and API keys
 */

// Stripe Product ID
export const STRIPE_PRODUCT_ID = import.meta.env.PROD ? 'prod_TMve7zGhAYx3z6' : 'prod_TMwe7vzhCHCaYM';

// Stripe Price IDs for different subscription plans
// export const STRIPE_PRICES = import.meta.env.PROD ? {
//   MONTHLY_SPORTSBOOK: 'price_1SQBmnBGvvwl5jan3VpoAg0u',    // $14.99/month - with sportsbook linking
//   MONTHLY_NO_SPORTSBOOK: 'price_1SQBmnBGvvwl5janCIQByy2s', // $24.99/month - without sportsbook linking
//   ANNUAL: 'price_1SQBmnBGvvwl5janaOLlyUAb'                 // $69.99/year - with sportsbook linking
// } : {
//   MONTHLY_SPORTSBOOK: 'price_1SQClKBGvvwl5janPSKqBDtF',    // $14.99/month - with sportsbook linking
//   MONTHLY_NO_SPORTSBOOK: 'price_1SQClLBGvvwl5janTvMKOcak', // $24.99/month - without sportsbook linking
//   ANNUAL: 'price_1SQClLBGvvwl5janMlzEfr9d'                 // $69.99/year - with sportsbook linking
// } as const;
export const STRIPE_PRICES = {
  MONTHLY_SPORTSBOOK: 'price_1SQClKBGvvwl5janPSKqBDtF',    // $14.99/month - with sportsbook linking
  MONTHLY_NO_SPORTSBOOK: 'price_1SQClLBGvvwl5janTvMKOcak', // $24.99/month - without sportsbook linking
  ANNUAL: 'price_1SQClLBGvvwl5janMlzEfr9d'                 // $69.99/year - with sportsbook linking
} as const;

// Stripe Publishable Key (from environment variable)
// export const STRIPE_PUBLISHABLE_KEY =
  // import.meta.env.PROD ? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY : "pk_test_51Ro7FvBGvvwl5jan0OGUcukdIf3Sy39lMLwSZkT6vFAe1xYvrn1gGyvx6Ywo8b6CwB985I4IQ89u35rx3RnD5ksJ0014PKOqwR";
export const STRIPE_PUBLISHABLE_KEY = "pk_test_51Ro7FvBGvvwl5jan0OGUcukdIf3Sy39lMLwSZkT6vFAe1xYvrn1gGyvx6Ywo8b6CwB985I4IQ89u35rx3RnD5ksJ0014PKOqwR";

// Map subscription plan to Stripe price ID
export const getPriceIdForPlan = (plan: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual'): string => {
  const priceMap: Record<string, string> = {
    'monthly_sportsbook': STRIPE_PRICES.MONTHLY_SPORTSBOOK,
    'monthly_no_sportsbook': STRIPE_PRICES.MONTHLY_NO_SPORTSBOOK,
    'annual': STRIPE_PRICES.ANNUAL
  };
  
  return priceMap[plan] || STRIPE_PRICES.MONTHLY_SPORTSBOOK;
};

// Map subscription plan to display name
export const getPlanDisplayName = (plan: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual'): string => {
  const nameMap: Record<string, string> = {
    'monthly_sportsbook': 'Monthly with Sportsbook',
    'monthly_no_sportsbook': 'Monthly without Sportsbook',
    'annual': 'Annual'
  };
  
  return nameMap[plan] || 'Unknown Plan';
};

// Map subscription plan to price in cents
export const getPriceInCents = (plan: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual'): number => {
  const priceMap: Record<string, number> = {
    'monthly_sportsbook': 1499,    // $14.99
    'monthly_no_sportsbook': 2499, // $24.99
    'annual': 6999                 // $69.99
  };
  
  return priceMap[plan] || 1499;
};

// Map subscription plan to price in dollars
export const getPriceInDollars = (plan: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual'): string => {
  const priceMap: Record<string, string> = {
    'monthly_sportsbook': '$14.99',
    'monthly_no_sportsbook': '$24.99',
    'annual': '$69.99'
  };
  
  return priceMap[plan] || '$14.99';
};

// Map subscription plan to billing period
export const getBillingPeriod = (plan: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual'): string => {
  const periodMap: Record<string, string> = {
    'monthly_sportsbook': '/month',
    'monthly_no_sportsbook': '/month',
    'annual': '/year'
  };

  return periodMap[plan] || '/month';
};

// Subscription plan definitions for dynamic rendering
export interface SubscriptionPlan {
  id: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual';
  name: string;
  price: string;
  priceInCents: number;
  billingPeriod: string;
  badge?: string;
  description?: string;
  features?: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly_sportsbook',
    name: 'Monthly (with Sportsbook)',
    price: '$14.99',
    priceInCents: 1499,
    billingPeriod: '/month',
    badge: 'Most Popular',
    description: 'Connect your sportsbook account for live data'
  },
  {
    id: 'monthly_no_sportsbook',
    name: 'Monthly (without Sportsbook)',
    price: '$24.99',
    priceInCents: 2499,
    billingPeriod: '/month',
    description: 'Manual tracking without sportsbook integration'
  },
  {
    id: 'annual',
    name: 'Annually',
    price: '$69.99',
    priceInCents: 6999,
    billingPeriod: '/year',
    badge: 'Best Value',
    description: 'Save 40% with annual billing'
  }
];

// Get subscription plan by ID
export const getSubscriptionPlan = (planId: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual'): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
};
