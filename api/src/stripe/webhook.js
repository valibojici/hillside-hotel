const webhook = async (req, res, context) => {
    const { models, stripe } = context;

    const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

    const sig = req.headers['stripe-signature'];

    let event;

    // make sure the request is from Stripe
    // https://stripe.com/docs/payments/checkout/fulfill-orders#handle-the-event
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    let reservationId;
    switch (event.type) {
        case 'checkout.session.completed':
            reservationId = event.data.object.client_reference_id;
            // client_reference_id is set in createReservationMutation call to stripe

            // update reservation status
            await models.Reservation.update({ status: 'completed' }, { where: { id: reservationId, status: 'pending' } });
            break;
        case 'checkout.session.expired':
            reservationId = event.data.object.client_reference_id;
            // client_reference_id is set in createReservationMutation call to stripe

            // update reservation status
            await models.Reservation.update({ status: 'canceled' }, { where: { id: reservationId, status: 'pending' } });
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
};

module.exports = { webhook };