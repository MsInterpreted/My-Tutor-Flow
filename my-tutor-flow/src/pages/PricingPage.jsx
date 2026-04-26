import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { PLANS, BOOK_PRICES, BUNDLE_PRICES } from '../config/pricing.js'
import ThemeToggle from '../components/ThemeToggle.jsx'

const FEATURES_FREE = ['1 free book (Comprehension Beginner)', 'First 2 units only', 'Interactive exercises', 'Progress tracking']

export default function PricingPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [currency, setCurrency] = useState('usd')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  const fmt = (usd, zar) => currency === 'zar' ? `R${zar}` : `$${usd}`

  async function handleStripe(planId, bookId) {
    if (!user) return navigate('/signup')
    setLoading(planId || bookId)
    setError('')
    try {
      const res = await fetch('/api/create-stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId, bookId,
          userId: user.uid,
          userEmail: user.email,
          currency,
          appUrl: window.location.origin,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error || 'Something went wrong')
    } catch {
      setError('Could not connect to payment provider. Please try again.')
    }
    setLoading('')
  }

  function handlePayFast(planId, bookId) {
    if (!user) return navigate('/signup')
    const isSandbox = import.meta.env.DEV
    const host = isSandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za'
    const appUrl = window.location.origin

    let amount, itemName
    if (planId === 'monthly') { amount = '179.00'; itemName = 'My Tutor Flow Monthly' }
    else if (planId === 'annual') { amount = '1299.00'; itemName = 'My Tutor Flow Annual' }
    else { amount = '99.00'; itemName = `My Tutor Flow Book` }

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `https://${host}/eng/process`

    const fields = {
      merchant_id: import.meta.env.VITE_PAYFAST_MERCHANT_ID || '15834683',
      merchant_key: import.meta.env.VITE_PAYFAST_MERCHANT_KEY || 'kzfvnvO5cob1t',
      return_url: `${appUrl}/checkout/success?method=payfast`,
      cancel_url: `${appUrl}/pricing`,
      notify_url: `${appUrl}/api/payfast-notify`,
      email_address: user.email,
      m_payment_id: `${user.uid}-${Date.now()}`,
      amount,
      item_name: itemName,
      custom_str1: user.uid,
      custom_str2: planId || '',
      custom_str3: bookId || '',
      subscription_type: (planId === 'monthly' || planId === 'annual') ? '1' : undefined,
      recurring_amount: amount,
      frequency: planId === 'annual' ? '6' : planId === 'monthly' ? '3' : undefined,
      cycles: '0',
    }

    Object.entries(fields).forEach(([k, v]) => {
      if (v === undefined) return
      const input = document.createElement('input')
      input.type = 'hidden'; input.name = k; input.value = v
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  }

  function checkout(planId, bookId) {
    if (currency === 'zar') handlePayFast(planId, bookId)
    else handleStripe(planId, bookId)
  }

  const current = profile?.subscription

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-4 sticky top-0 z-10">
        <Link to="/" className="text-violet-700 font-bold text-lg font-display">My Tutor Flow</Link>
        <div className="ml-auto flex items-center gap-3">
          {user ? <Link to="/books" className="text-sm text-violet-700 font-semibold hover:underline">My Books →</Link>
                : <Link to="/signup" className="text-sm bg-violet-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-violet-800">Start Free</Link>}
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-black text-slate-800 dark:text-slate-100 mb-3">Simple, honest pricing</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-6">Start free. Upgrade when you're ready.</p>

          {/* Currency toggle */}
          <div className="inline-flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 gap-1">
            {[['usd', '🌍 USD'], ['zar', '🇿🇦 ZAR']].map(([c, label]) => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${currency === c ? 'bg-white dark:bg-slate-600 text-violet-700 dark:text-violet-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm mb-6 max-w-md mx-auto text-center">{error}</div>}

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">

          {/* Free */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Free Explorer</p>
              <div className="flex items-end gap-1"><span className="text-4xl font-black text-slate-800 dark:text-slate-100">Free</span></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">No card needed</p>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {FEATURES_FREE.map(f => <li key={f} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>{f}</li>)}
            </ul>
            {user ? <Link to="/books" className="block text-center border border-violet-300 dark:border-violet-600 text-violet-700 dark:text-violet-400 font-semibold py-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/30">Go to Books</Link>
                  : <Link to="/signup" className="block text-center border border-violet-300 dark:border-violet-600 text-violet-700 dark:text-violet-400 font-semibold py-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/30">Start Free</Link>}
          </div>

          {/* Monthly */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-violet-600 p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
            <div className="mb-4">
              <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">All-Access Monthly</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{fmt(PLANS.monthly.usd, PLANS.monthly.zar)}</span>
                <span className="text-slate-400 text-sm mb-1">/month</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">All 9 books, cancel anytime</p>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {PLANS.monthly.features.map(f => <li key={f} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2"><span className="text-violet-500 mt-0.5">✓</span>{f}</li>)}
            </ul>
            <button onClick={() => checkout('monthly', null)} disabled={loading === 'monthly' || current === 'premium'}
              className="w-full bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 transition-colors disabled:opacity-50">
              {current === 'premium' ? '✓ Current Plan' : loading === 'monthly' ? 'Loading…' : `Subscribe — ${fmt(PLANS.monthly.usd, PLANS.monthly.zar)}/mo`}
            </button>
          </div>

          {/* Annual */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">All-Access Annual</p>
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">Save 30%</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{fmt(PLANS.annual.usd, PLANS.annual.zar)}</span>
                <span className="text-slate-400 text-sm mb-1">/year</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Best value for committed learners</p>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {PLANS.annual.features.map(f => <li key={f} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span>{f}</li>)}
            </ul>
            <button onClick={() => checkout('annual', null)} disabled={loading === 'annual' || current === 'premium'}
              className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50">
              {current === 'premium' ? '✓ Current Plan' : loading === 'annual' ? 'Loading…' : `Subscribe — ${fmt(PLANS.annual.usd, PLANS.annual.zar)}/yr`}
            </button>
          </div>
        </div>

        {/* Per-book section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
          <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-1">Prefer to buy individual books?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Pay once, own forever. No subscription required.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-5 text-center">
              <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">Single Book</p>
              <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">{fmt(BOOK_PRICES.usd, BOOK_PRICES.zar)}</p>
              <p className="text-xs text-slate-400 mb-4">One book, all levels</p>
              <button onClick={() => navigate('/books')} className="w-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-semibold py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">Choose a Book</button>
            </div>
            <div className="border border-violet-200 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20 rounded-xl p-5 text-center">
              <p className="font-bold text-violet-700 dark:text-violet-400 mb-1">Series Bundle</p>
              <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">{fmt(BUNDLE_PRICES.series.usd, BUNDLE_PRICES.series.zar)}</p>
              <p className="text-xs text-slate-400 mb-4">3 books in one series</p>
              <button onClick={() => checkout(null, 'bundle-series')} disabled={!!loading}
                className="w-full bg-violet-700 text-white text-sm font-semibold py-2 rounded-lg hover:bg-violet-800 disabled:opacity-50">
                {loading === 'bundle-series' ? 'Loading…' : 'Buy Bundle'}
              </button>
            </div>
            <div className="border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 text-center">
              <p className="font-bold text-amber-700 dark:text-amber-400 mb-1">All 9 Books</p>
              <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">{fmt(BUNDLE_PRICES.all9.usd, BUNDLE_PRICES.all9.zar)}</p>
              <p className="text-xs text-slate-400 mb-4">Complete library, no subscription</p>
              <button onClick={() => checkout(null, 'bundle-all9')} disabled={!!loading}
                className="w-full bg-amber-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-amber-600 disabled:opacity-50">
                {loading === 'bundle-all9' ? 'Loading…' : 'Buy All 9'}
              </button>
            </div>
          </div>
        </div>

        {/* Institution CTA */}
        <div className="mt-8 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl mb-1">🏫 Institution & School Pricing</h3>
            <p className="text-slate-300 text-sm">Up to 30 students, teacher dashboard, progress reports, book assignment. From {fmt(199, 3499)}/year.</p>
          </div>
          <a href="mailto:hello@mytutorflow.com?subject=Institution Pricing" className="whitespace-nowrap bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors">
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  )
}
