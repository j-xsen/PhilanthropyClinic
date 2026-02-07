'use server'

import {stripe} from '../../lib/stripe'

type CheckoutOptions = {
    amount: number;
    name: string;
};

const DONATIONS: Record<number, CheckoutOptions> = {
    1: { amount: 1, name: '$1 Philanthropy' },
    5: { amount: 5, name: '$5 Philanthropy' },
    10: { amount: 10, name: '$10 Philanthropy' },
};

export async function startCheckoutSession(donationId: number) {
    const donation = DONATIONS[donationId];

    if (!donation) {
        return new Response(
            JSON.stringify({ error: 'Donation not found' }),
            { status: 400 }
        );
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        redirect_on_completion: 'never',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: donation.name,
                        description: "Support the Jaxsenville mission!",
                    },
                    unit_amount: donation.amount,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
    })

    return session.client_secret
}