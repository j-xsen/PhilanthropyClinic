import type { VercelRequest, VercelResponse } from '@vercel/node'
import { stripe } from '../src/lib/stripe'

type CheckoutOptions = {
  amount: number
  name: string
}

const DONATIONS: Record<number, CheckoutOptions> = {
  1: { amount: 100, name: '$1 Philanthropy' },
  5: { amount: 500, name: '$5 Philanthropy' },
  10: { amount: 1000, name: '$10 Philanthropy' },
}

// Vercel Serverless function handler
async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { donationId } = req.body || {}
    const id = typeof donationId === 'string' ? Number(donationId) : donationId

    const donation = DONATIONS[id]

    if (!donation) {
      res.status(400).json({ error: 'Donation not found' })
      return
    }

    const url = process.env.VERCEL_URL ? process.env.VERCEL_URL : "http://localhost:5173/"

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: donation.name,
              description: 'Support the Jaxsenville mission!',
            },
            unit_amount: donation.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: url+ `?id={CHECKOUT_SESSION_ID}`,
      cancel_url: url + `?canceled=true`,
      automatic_tax: { enabled: true },
    })

    res.status(200).json({ client_secret: session.client_secret, sessionId: session.id })
  } catch (err: unknown) {
      if(err instanceof Error) {
          console.error('Checkout error', err)
          res.status(500).json({error: err.message || 'Internal error'})
      } else {
          res.status(500).json({error: 'Internal error'})
      }
  }
}

export default handler

