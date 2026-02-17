import type {VercelRequest, VercelResponse} from "@vercel/node";
import Stripe from "stripe";

async function verifyHandler(req: VercelRequest, res: VercelResponse) {
    const {session_id} = req.query

    if (req.method !== 'POST') {
        res.status(405).json({error: 'Method not allowed'})
        return
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    try {
        if (typeof session_id !== 'string') {
            res.status(400).json({error: 'Invalid session ID'})
            return
        }
        const sessionId = await stripe.checkout.sessions.retrieve(session_id);

        if (!sessionId) {
            res.status(400).json({error: 'Session not found'})
            return
        }

        if (sessionId.payment_status === 'paid') {
            res.status(200).json({success: true})
        } else {
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
