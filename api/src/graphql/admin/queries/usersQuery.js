const { GraphQLList } = require("graphql");
const { userType } = require("../../types/userType");

module.exports = {
    type: new GraphQLList(userType),
    resolve: async (parent, args, { jwtPayload, models }) => {
        return models.User.findAll();
    }
}