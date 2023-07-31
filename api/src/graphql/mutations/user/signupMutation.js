const { GraphQLNonNull, GraphQLString, GraphQLError } = require("graphql");
const { userType } = require("../../types/userType");
const bcrypt = require('bcryptjs');

module.exports = {
    type: userType,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, { jwtPayload }) => {
        const { email } = jwtPayload?.data || {};
        if (!email) {
            throw new GraphQLError('Invalid token.');
        }

        // check if user has already signed up
        if ((await models.User.findOne({ where: { email: email } }))) {
            throw new GraphQLError('Already signed up.');
        }

        const hashedPassword = await models.User.hash(args.password);
        const user = await models.User.create({
            username: args.username,
            password: hashedPassword,
            email: email,
            role: 'user'
        });

        return user;
    }
}