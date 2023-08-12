const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString, GraphQLEnumType } = require("graphql");
const { models } = require("../../models");
const { reservationStatusType } = require("./reservationStatusType");

const reservationType = new GraphQLObjectType({
    name: 'Reservation',
    fields: () => {
        // do this to avoid cyclic depedency
        const { userType } = require("./userType");
        const { roomType } = require("./roomType");

        return ({
            id: { type: GraphQLID },
            userId: { type: GraphQLID },
            roomId: { type: GraphQLID },
            checkIn: { type: GraphQLString, description: 'Timestamp string' },
            checkOut: { type: GraphQLString, description: 'Timestamp string' },
            createdAt: { type: GraphQLString, description: 'Timestamp string' },
            total: { type: GraphQLInt },
            status: { type: reservationStatusType },
            user: {
                type: userType,
                resolve: async (parent, args, context) => (await parent.getUser())
                // resolve: async (parent, args, context) => (await models.User.findByPk(parent.userId))
            },
            room: {
                type: roomType,
                resolve: async (parent, args, context) => (await parent.getRoom())
            },
            createdAt: { type: GraphQLString, description: 'Timestamp string' },
            updatedAt: { type: GraphQLString, description: 'Timestamp string' },
            paymentUrl: { type: GraphQLString },
        });
    }
})

module.exports = { reservationType };