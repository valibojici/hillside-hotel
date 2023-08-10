const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString } = require("graphql");
const { roomTypeType } = require("./roomTypeType");
const { models } = require("../../models");

const roomType = new GraphQLObjectType({
    name: 'Room',
    fields: () => ({
        id: { type: GraphQLID },
        roomNumber: { type: GraphQLInt },
        roomTypeId: { type: GraphQLID },
        roomType: {
            type: roomTypeType,
            resolve: async (parent, args, context) => (await parent.getRoomType())
        },
        image: { type: GraphQLString },
        createdAt: { type: GraphQLString, description: 'Timestamp string' },
        updatedAt: { type: GraphQLString, description: 'Timestamp string' },
    })
})

module.exports = { roomType };