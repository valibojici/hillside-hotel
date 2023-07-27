const { GraphQLList } = require("graphql");
const { models } = require('../../../models');
const { roomType } = require("../../types/roomType");

module.exports = {
    type: new GraphQLList(roomType),
    resolve: async (parent, args, context) => {
        return (await models.Room.findAll());
    }
}