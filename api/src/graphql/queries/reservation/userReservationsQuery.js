const { GraphQLList, GraphQLNonNull, GraphQLInt } = require("graphql");
const { reservationType } = require("../../types/reservationType");
const { models } = require('../../../models');

module.exports = {
    type: new GraphQLList(reservationType),
    args: {
        userId: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, { userId }, context) => {
        const user = await models.User.findByPk(userId);
        if (!user) {
            return null;
        }
        return (await user.getReservations());
    }
}