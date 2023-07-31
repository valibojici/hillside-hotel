const { GraphQLNonNull, GraphQLInt, GraphQLID } = require("graphql");
const { roomType } = require("../../../types/roomType");
const createHelper = require("../utils/createHelper");

module.exports = {
    type: roomType,
    args: {
        roomTypeId: { type: new GraphQLNonNull(GraphQLID) },
        roomNumber: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        return (await createHelper(models.Room, args));
    }
}