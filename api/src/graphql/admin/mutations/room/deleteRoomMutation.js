const { GraphQLNonNull, GraphQLError, GraphQLID } = require("graphql");
const { roomType } = require("../../../types/roomType");
const deleteHelper = require("../utils/deleteHelper");

module.exports = {
    type: roomType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, { id }, { jwtPayload, models }) => {
        return (await deleteHelper(models.Room, id));
    }
}