const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString, GraphQLList } = require("graphql");

const roomTypeType = new GraphQLObjectType({
    name: 'RoomType',
    fields: () => {
        const { roomType } = require("./roomType");

        return ({
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            description: { type: GraphQLString },
            image: { type: GraphQLString },
            price: { type: GraphQLInt },
            createdAt: { type: GraphQLString, description: 'Timestamp string' },
            updatedAt: { type: GraphQLString, description: 'Timestamp string' },
            rooms: {
                type: new GraphQLList(roomType),
                resolve: async (parent, args, { jwtPayload }) => {
                    if (jwtPayload?.data?.role !== 'admin') {
                        return null;
                    }
                    return (await parent.getRooms());
                }
            }
        });
    }
})

module.exports = { roomTypeType };