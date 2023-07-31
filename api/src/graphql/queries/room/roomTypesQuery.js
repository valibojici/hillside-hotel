const { GraphQLList } = require("graphql");
const { roomTypeType } = require("../../types/roomTypeType");

module.exports = {
    type: new GraphQLList(roomTypeType),
    resolve: async (parent, args, { models }) => (await models.RoomType.findAll())
}