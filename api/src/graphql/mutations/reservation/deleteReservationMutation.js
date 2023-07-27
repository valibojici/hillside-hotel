const { GraphQLList, GraphQLID, GraphQLNonNull, GraphQLError } = require("graphql");
const { reservationType } = require("../../types/reservationType");
const { models } = require('../../../models');

module.exports = {
    type: reservationType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, { id }, context) => {
        const reservation = (await models.Reservation.findByPk(id));
        if (!reservation) {
            throw new GraphQLError('Invalid ID');
        }
        await reservation.destroy();
        return reservation;
    }
}