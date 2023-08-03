const { GraphQLNonNull, GraphQLID, GraphQLError } = require("graphql");
const { userType } = require("../../types/userType");

module.exports = {
    type: userType,
    args: {
        id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, { id }, { jwtPayload, models }) => {
        if (jwtPayload?.data?.userId.toString() !== id) {
            throw new GraphQLError('Unauthenticated');
        }
        return (await models.User.findByPk(id));
    }
}