const { GraphQLNonNull, GraphQLError, GraphQLID } = require("graphql");
const { userType } = require("../../../types/userType");

module.exports = {
    type: userType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, { id }, { jwtPayload, models }) => {
        if (id == jwtPayload.data.userId) {
            throw new GraphQLError('Cannot delete current user');
        }
        const user = await models.User.findByPk(id);
        if (!user) {
            throw new GraphQLError('Invalid ID');
        }
        await user.destroy();
        return user;
    }
}