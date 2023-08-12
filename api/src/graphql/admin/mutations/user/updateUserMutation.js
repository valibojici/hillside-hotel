const { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError } = require("graphql");
const { userType, userRoleType } = require("../../../types/userType");
const { ValidationError } = require("sequelize");
const updateHelper = require("../utils/updateHelper");

module.exports = {
    type: userType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        role: { type: userRoleType },
        email: { type: GraphQLString },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        if (args.password) {
            args.password = await models.User.hashPassword(args.password);
        }
        return (await updateHelper(models.User, args));
    }
}