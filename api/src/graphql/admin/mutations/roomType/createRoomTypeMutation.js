const { GraphQLNonNull, GraphQLInt, GraphQLString } = require("graphql");
const { roomTypeType } = require("../../../types/roomTypeType");
const createHelper = require("../utils/createHelper");

module.exports = {
    type: roomTypeType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        return (await createHelper(models.RoomType, args));
    }
}