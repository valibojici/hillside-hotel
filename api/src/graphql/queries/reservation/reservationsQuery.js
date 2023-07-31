const { GraphQLList } = require("graphql");
const { reservationType } = require("../../types/reservationType");

module.exports = {
    type: new GraphQLList(reservationType),
    resolve: async (parent, args, { jwtPayload, models }) => {
        if (!jwtPayload?.data?.userId) {
            throw new Error('Unauthenticated');
        }
        const user = await models.User.findByPk(jwtPayload.data.userId);
        return (await user.getReservations());
    }
}