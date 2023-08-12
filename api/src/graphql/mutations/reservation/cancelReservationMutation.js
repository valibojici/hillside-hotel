const { GraphQLID, GraphQLNonNull, GraphQLError } = require("graphql");
const { reservationType } = require("../../types/reservationType");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
    type: reservationType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, { id }, { models }) => {
        const reservation = (await models.Reservation.findByPk(id));
        if (!reservation) {
            throw new GraphQLError('Invalid ID');
        }
        if (reservation.status != 'pending') {
            throw new GraphQLError('Reservation is canceled or completed');
        }

        try {
            await stripe.checkout.sessions.expire(reservation.checkoutSessionId);
        } catch (error) {
            console.log(error);
        }

        await reservation.set({ status: 'canceled' });
        await reservation.save();
        return reservation;
    }
}