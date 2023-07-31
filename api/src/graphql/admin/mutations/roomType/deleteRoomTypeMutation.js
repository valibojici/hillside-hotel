const { GraphQLNonNull, GraphQLError, GraphQLID } = require("graphql");
const { roomTypeType } = require("../../../types/roomTypeType");
const deleteHelper = require("../utils/deleteHelper");

module.exports = {
    type: roomTypeType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, { id }, { jwtPayload, models }) => {
        return (await deleteHelper(models.RoomType, id));
    }
}