const { GraphQLList, GraphQLID, GraphQLNonNull, GraphQLError } = require("graphql");
const { reservationType } = require("../../types/reservationType");

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
        await reservation.set({ status: 'canceled' });
        await reservation.save();
        return reservation;
    }
}