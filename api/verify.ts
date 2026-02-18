import type {VercelRequest, VercelResponse} from "@vercel/node";
import Stripe from "stripe";
import 'dotenv/config'

async function verifyHandler(req: VercelRequest, res: VercelResponse) {
    if(!process.env.STRIPE_PRIVATE_KEY) {
        console.log('Stripe private key not configured')
        return
    }
    const {session_id} = req.body
    if(!session_id) {
        console.log(`Session ID not provided.`)
        res.status(400).json({error: 'Session ID is required'})
        return
    }

    if (req.method !== 'POST') {
        res.status(405).json({error: 'Method not allowed'})
        return
    }

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!)

    try {
        const sessionId = await stripe.checkout.sessions.retrieve(session_id as string);

        if (!sessionId) {
            res.status(400).json({error: 'Session not found'})
            return
        }

        if (sessionId.payment_status === 'paid') {
            console.log("Payment verified for session:", session_id)
            res.status(200).json({success: true})
        } else {
            console.log(`Payment not completed for session ${session_id}. Status: ${sessionId.payment_status}`)
            res.status(400).json({error: 'Payment not completed'})
        }

    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Verification error', err)
            res.status(500).json({error: 'Internal server error'})
        } else {
            res.status(500).json({error: 'Unknown error'})
        }
    }
}

export default verifyHandler
