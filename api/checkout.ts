import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from "stripe";
import type {CheckoutOptions} from "../src/types/CheckoutOptions";

export const DONATIONS: Record<number, CheckoutOptions> = {
  1: {
    id: 'price_1Szq3vGbKD5hD1XEJ9xkEkNF',
    amount: 100,
    name: '$1 Philanthropy'
  },
  5: {
    id: 'price_1Szq4QGbKD5hD1XECkAem2El',
    amount: 500,
    name: '$5 Philanthropy'
  },
  10: {
    id: 'price_1Szq4lGbKD5hD1XEVbxm6TL6',
    amount: 1000,
    name: '$10 Philanthropy'
  },
}

// Vercel Serverless function handler
async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { amount } = req.body || {}

    if (isNaN(amount)) {
        res.status(400).json({ error: 'Invalid donation ID' })
    }

    const donation = DONATIONS[amount]

    if (!donation) {
      res.status(400).json({ error: 'Donation not found' })
      return
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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
      success_url: `/?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `/`,
      automatic_tax: { enabled: true },
    })

    res.json({url:session.url})
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

