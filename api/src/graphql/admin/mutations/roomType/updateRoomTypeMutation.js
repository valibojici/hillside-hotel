const { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError } = require("graphql");
const { roomTypeType } = require("../../../types/roomTypeType");
const updateHelper = require("../utils/updateHelper");

module.exports = {
    type: roomTypeType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLInt },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        return (await updateHelper(models.RoomType, args));
    }
}