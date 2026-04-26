import Stripe from 'stripe'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { planId, bookId, userId, userEmail, currency = 'usd', appUrl } = JSON.parse(event.body || '{}')

  const baseUrl = appUrl || process.env.VITE_APP_URL || 'https://mytutorflow.com'

  try {
    let sessionConfig = {
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { userId, planId: planId || '', bookId: bookId || '' },
    }

    if (planId === 'monthly') {
      const priceData = currency === 'zar'
        ? { currency: 'zar', unit_amount: 17900, recurring: { interval: 'month' } }
        : { currency: 'usd', unit_amount: 1000,  recurring: { interval: 'month' } }
      sessionConfig.mode = 'subscription'
      sessionConfig.line_items = [{ price_data: { ...priceData, product_data: { name: 'My Tutor Flow — Monthly All-Access' } }, quantity: 1 }]

    } else if (planId === 'annual') {
      const priceData = currency === 'zar'
        ? { currency: 'zar', unit_amount: 129900, recurring: { interval: 'year' } }
        : { currency: 'usd', unit_amount: 7500,  recurring: { interval: 'year' } }
      sessionConfig.mode = 'subscription'
      sessionConfig.line_items = [{ price_data: { ...priceData, product_data: { name: 'My Tutor Flow — Annual All-Access' } }, quantity: 1 }]

    } else if (bookId) {
      const amount = currency === 'zar' ? 9900 : 600
      sessionConfig.mode = 'payment'
      sessionConfig.line_items = [{ price_data: { currency: currency === 'zar' ? 'zar' : 'usd', unit_amount: amount, product_data: { name: `My Tutor Flow — ${bookId.replace(/-/g, ' ')}` } }, quantity: 1 }]

    } else {
      return { statusCode: 400, body: JSON.stringify({ error: 'planId or bookId required' }) }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: session.url }) }

  } catch (err) {
    console.error('Stripe error:', err)
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
