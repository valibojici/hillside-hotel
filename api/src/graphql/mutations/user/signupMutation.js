const { GraphQLNonNull, GraphQLString, GraphQLError } = require("graphql");
const { userType } = require("../../types/userType");
const { ValidationError } = require("sequelize");

module.exports = {
    type: userType,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        const { email } = jwtPayload?.data || {};
        if (!email) {
            throw new GraphQLError('Invalid token.');
        }

        if (args.password.length < 8) {
            throw new GraphQLError('Password must be at least 8 characters');
        }

        // check if user has already signed up
        if ((await models.User.findOne({ where: { email: email } }))) {
            throw new GraphQLError('Already signed up.');
        }

        const hashedPassword = await models.User.hashPassword(args.password);

        try {
            const user = await models.User.create({
                username: args.username,
                password: hashedPassword,
                email: email,
                role: 'user'
            });
            return user;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new GraphQLError(error.errors.map(e => e.message).join('.'));
            }
            throw error;
        }

    }
}