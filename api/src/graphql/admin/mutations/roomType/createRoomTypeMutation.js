const { GraphQLNonNull, GraphQLError, GraphQLInt, GraphQLString } = require("graphql");
const { roomTypeType } = require("../../../types/roomTypeType");
const createHelper = require("../utils/createHelper");
const { ValidationError } = require("sequelize");
const fs = require('fs');
const { saveToPublic, deleteFromPublic, validateBase64 } = require("../../../utils/images");

module.exports = {
    type: roomTypeType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        const imgPath = `/images/${args.name}.png`;
        try {
            // create image
            const { image, ...rest } = args;
            validateBase64(image);

            rest.image = imgPath

            const instance = await models.RoomType.create(rest);

            // save img if ok
            saveToPublic(imgPath, image);
            return await models.RoomType.findByPk(instance.id);
        } catch (error) {
            console.log(error);
            throw new GraphQLError(error instanceof ValidationError ? error.errors.map(e => e.message).join(' ') : 'Something went wrong...');
        }
    }
}