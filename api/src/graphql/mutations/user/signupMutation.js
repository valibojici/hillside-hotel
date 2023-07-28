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

        // TODO check password length (size in bytes) https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length
        salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(args.password, salt);
        const user = await models.User.create({
            username: args.username,
            password: hash,
            email: email,
            role: 'user'
        });

        return user;
    }
}