const { GraphQLList } = require("graphql");
const { models } = require("../../../models");
const { roomTypeType } = require("../../types/roomTypeType");

module.exports = {
    type: new GraphQLList(roomTypeType),
    resolve: async (parent, args, context) => (await models.RoomType.findAll())
}