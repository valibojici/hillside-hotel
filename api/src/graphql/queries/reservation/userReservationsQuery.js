const { GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLError } = require("graphql");
const { reservationType } = require("../../types/reservationType");
const { models } = require('../../../models');

module.exports = {
    type: new GraphQLList(reservationType),
    resolve: async (parent, args, { jwtPayload }) => {
        const { userId } = jwtPayload?.data || {};
        if (!userId) {
            throw new GraphQLError('Unauthenticated');
        }
        const user = await models.User.findByPk(userId);
        if (!user) {
            return null;
        }
        return (await user.getReservations());
    }
}