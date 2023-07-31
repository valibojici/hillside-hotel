const { GraphQLList } = require("graphql");
const { roomTypeType } = require("../../types/roomTypeType");

module.exports = {
    type: new GraphQLList(roomTypeType),
    resolve: async (parent, args, { jwtPayload, models }) => {
        return models.RoomType.findAll();
    }
}