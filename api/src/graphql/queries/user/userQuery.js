const { GraphQLNonNull, GraphQLInt } = require("graphql");
const { userType } = require("../../types/userType");
const { models } = require("../../../models");

module.exports = {
    type: userType,
    args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
    },
    resolve: async (parent, { id }, context) => {
        return (await models.User.findByPk(id));
    }
}