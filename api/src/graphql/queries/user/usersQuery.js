const { GraphQLList } = require("graphql");
const { userType } = require("../../types/userType");
const { models } = require('../../../models');

module.exports = {
    type: new GraphQLList(userType),
    resolve: async (parent, args, context) => {
        return (await models.User.findAll());
    }
}