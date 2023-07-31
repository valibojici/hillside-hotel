const { GraphQLNonNull, GraphQLInt, GraphQLError, GraphQLID, GraphQLString } = require("graphql");
const { ValidationError } = require("sequelize");
const { userType, userRoleType } = require("../../../types/userType");
const createHelper = require("../utils/createHelper");

module.exports = {
    type: userType,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(userRoleType) },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        args.password = await models.User.hashPassword(args.password);
        return (await createHelper(models.User, args));
    }
}