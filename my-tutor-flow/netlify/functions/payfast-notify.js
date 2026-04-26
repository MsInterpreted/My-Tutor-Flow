import https from 'https'
import crypto from 'crypto'

function verifyPayFast(params, passphrase) {
  const keys = Object.keys(params).filter(k => k !== 'signature').sort()
  let str = keys.map(k => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, '+')}`).join('&')
  if (passphrase) str += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`
  return crypto.createHash('md5').update(str).digest('hex') === params.signature
}

function payfastRequest(host, path) {
  return new Promise((resolve, reject) => {
    const options = { hostname: host, port: 443, path, method: 'GET', headers: { 'User-Agent': 'Node' } }
    https.get(options, res => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => resolve(data.trim()))
    }).on('error', reject)
  })
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' }

  const params = Object.fromEntries(new URLSearchParams(event.body))
  const passphrase = process.env.PAYFAST_PASSPHRASE || ''
  const isSandbox = process.env.PAYFAST_SANDBOX === 'true'
  const pfHost = isSandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za'

  if (!verifyPayFast(params, passphrase)) {
    console.error('PayFast signature verification failed')
    return { statusCode: 400, body: 'Invalid signature' }
  }

  const paramStr = Object.keys(params).filter(k => k !== 'signature')
    .map(k => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, '+')}`)
    .join('&')

  const valid = await payfastRequest(pfHost, `/eng/query/validate?${paramStr}`)
  if (valid !== 'VALID') {
    console.error('PayFast server validation failed:', valid)
    return { statusCode: 400, body: 'PayFast validation failed' }
  }

  const { payment_status, custom_str1: userId, custom_str2: planId, custom_str3: bookId } = params

  if (payment_status === 'COMPLETE') {
    console.log('PayFast payment complete:', { userId, planId, bookId })
  }

  return { statusCode: 200, body: 'OK' }
}
