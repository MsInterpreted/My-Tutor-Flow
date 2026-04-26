import Stripe from 'stripe'

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method not allowed' }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sessionId = event.queryStringParameters?.session_id

  if (!sessionId) return { statusCode: 400, body: JSON.stringify({ error: 'session_id required' }) }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const paid = session.payment_status === 'paid' || session.status === 'complete'

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paid,
        userId: session.client_reference_id,
        planId: session.metadata?.planId || null,
        bookId: session.metadata?.bookId || null,
        subscription: session.subscription || null,
        mode: session.mode,
      }),
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
