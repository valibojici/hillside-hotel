const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt, GraphQLEnumType } = require("graphql");

const userRoleType = new GraphQLEnumType({
    name: "UserRole",
    values: {
        'user': { value: "user" },
        'admin': { value: "admin" },
    }
})

const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => {
        const { reservationType } = require("./reservationType");

        return ({
            id: { type: GraphQLID },
            username: { type: GraphQLString },
            email: { type: GraphQLString },
            password: {
                type: GraphQLString,
                resolve: (parent, args, { jwtPayload }) => {
                    const role = jwtPayload?.data?.role;
                    return role === 'admin' ? parent.password : null;
                }
            },
            role: { type: userRoleType },
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

module.exports = { userRoleType, userType };