const { GraphQLNonNull, GraphQLInt, GraphQLError } = require("graphql");
const { userType } = require("../../types/userType");

module.exports = {
    type: userType,
    args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
    },
    resolve: async (parent, { id }, { jwtPayload, models }) => {
        if (jwtPayload?.data?.userId !== id) {
            throw new GraphQLError('Unauthenticated');
        }
        return (await models.User.findByPk(id));
    }
}