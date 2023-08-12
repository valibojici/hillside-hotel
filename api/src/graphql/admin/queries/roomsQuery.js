const { GraphQLList } = require("graphql");
const { roomType } = require("../../types/roomType");

module.exports = {
    type: new GraphQLList(roomType),
    resolve: async (parent, args, { jwtPayload, models }) => {
        return models.Room.findAll();
    }
}