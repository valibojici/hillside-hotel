const { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError } = require("graphql");
const { roomTypeType } = require("../../../types/roomTypeType");
const updateHelper = require("../utils/updateHelper");
const { deleteFromPublic, saveToPublic, renameInPublic, validateBase64 } = require("../../../utils/images");
const { ValidationError } = require("sequelize");

module.exports = {
    type: roomTypeType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        image: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLInt },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        const instance = await models.RoomType.findByPk(args.id);
        if (!instance) {
            throw new GraphQLError('Invalid ID.');
        }
        // get only args which are non null
        const nonNullArgs = Object.fromEntries(Object.entries(args).filter(([key, value]) => key != 'id' && value))

        if (nonNullArgs.image) {
            validateBase64(nonNullArgs.image);

            // delete old image
            deleteFromPublic(instance.image);
            // save new one
            const imgPath = `images/${nonNullArgs.name ?? instance.name}.png`;
            saveToPublic(imgPath, nonNullArgs.image);
            // set image value to path (was base64)
            nonNullArgs.image = imgPath;
            instance.changed('updatedAt', true);

        } else if (nonNullArgs.name) {
            // no image but name changed => change filename & change path
            const newPath = `images/${nonNullArgs.name}.png`;
            renameInPublic(instance.image, newPath);
            nonNullArgs.image = newPath;
        }

        try {
            await instance.set(nonNullArgs);
            await instance.save();
        } catch (error) {
            console.log(error);
            throw new GraphQLError(error instanceof ValidationError ? error.errors.map(e => e.message).join(' ') : 'Something went wrong...');
        }

        return (await models.RoomType.findByPk(args.id));
    }
}