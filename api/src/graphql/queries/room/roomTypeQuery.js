const { GraphQLNonNull, GraphQLInt } = require("graphql");
const { models } = require("../../../models");
const { roomTypeType } = require("../../types/roomTypeType");

module.exports = {
    type: roomTypeType,
    args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
    },
    resolve: async (parent, { id }, context) => (await models.RoomType.findByPk(id))
}