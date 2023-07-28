const { GraphQLNonNull, GraphQLID, GraphQLError } = require("graphql");
const { userType } = require("../../types/userType");
const { models } = require("../../../models");

module.exports = {
    type: userType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, { id }, context) => {
        const user = await models.User.findOne({ where: { id: id } });
        if (!user) {
            throw new GraphQLError('Invalid ID.');
        }
        await user.destroy();
        return user;
    }
}