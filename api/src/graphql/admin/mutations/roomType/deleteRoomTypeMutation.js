const { GraphQLNonNull, GraphQLError, GraphQLID } = require("graphql");
const { roomTypeType } = require("../../../types/roomTypeType");
const { deleteFromPublic } = require("../../../utils/images");

module.exports = {
    type: roomTypeType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, { id }, { jwtPayload, models }) => {
        const instance = await models.RoomType.findByPk(id);
        if (!instance) {
            throw new GraphQLError('Invalid ID');
        }

        // delete room img
        deleteFromPublic(instance.image);

        await instance.destroy();
        return instance;
    }
}