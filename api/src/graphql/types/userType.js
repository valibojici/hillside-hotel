const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } = require("graphql");

const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => {
        const { reservationType } = require("./reservationType");

        return ({
            id: { type: GraphQLID },
            username: { type: GraphQLString },
            email: { type: GraphQLString },
            role: { type: GraphQLString },
            createdAt: { type: GraphQLString, description: 'Timestamp string' },
            updatedAt: { type: GraphQLString, description: 'Timestamp string' },
            reservations: {
                type: new GraphQLList(reservationType),
                resolve: (parent, args, context) => {
                    return parent.getReservations();
                }
            }
        });
    }
})

module.exports = { userType };