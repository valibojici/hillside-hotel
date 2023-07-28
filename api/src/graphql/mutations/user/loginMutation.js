const { GraphQLNonNull, GraphQLString, GraphQLError } = require("graphql");
const { userType } = require("../../types/userType");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    type: GraphQLString,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
        // get user from DB
        const user = await models.User.findOne({ where: { username: args.username } });
        if (!user) {
            throw new GraphQLError('Incorrect username or password.');
        }

        // compare passwords
        const result = await bcrypt.compare(args.password, user.password);
        if (!result) {
            throw new GraphQLError('Incorrect username or password.');
        }

        // create JWT
        const token = jwt.sign(
            { data: { userId: user.id, role: user.role } },
            process.env.JWT_SECRET,
            { expiresIn: '6h' },
        );

        return token;
    }
}