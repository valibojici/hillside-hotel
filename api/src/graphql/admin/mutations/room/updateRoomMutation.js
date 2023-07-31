const { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError } = require("graphql");
const { roomType } = require("../../../types/roomType");
const updateHelper = require("../utils/updateHelper");

module.exports = {
    type: roomType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        roomTypeId: { type: GraphQLID },
        roomNumber: { type: GraphQLInt },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        return (await updateHelper(models.Room, args));
    }
}