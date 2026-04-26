export const TRIAL_BOOK_ID = 'comprehension-beginner'
export const TRIAL_UNIT_LIMIT = 2

export const PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    descr: 'All 9 books, cancel anytime',
    usd: 10,
    zar: 179,
    period: '/month',
    stripe_price_id: '', // fill after creating in Stripe dashboard
    features: ['All 9 books unlocked', 'Full interactive exercises', 'PEEL writing boxes', 'Progress dashboard', 'Achievement certificates'],
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    descr: 'Best value — save 30%',
    usd: 75,
    zar: 1299,
    period: '/year',
    stripe_price_id: '', // fill after creating in Stripe dashboard
    badge: 'Best Value',
    features: ['Everything in Monthly', '30% discount', 'Priority support', 'Early access to new books'],
  },
}

export const BOOK_PRICES = {
  usd: 6,
  zar: 99,
}

export const BUNDLE_PRICES = {
  series: { usd: 15, zar: 249 },
  all9:   { usd: 35, zar: 599 },
}
