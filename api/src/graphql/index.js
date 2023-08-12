const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const reservationsQuery = require('./queries/reservation/reservationsQuery');
const availableRoomTypesQuery = require('./queries/room/availableRoomTypesQuery');
const createReservationMutation = require('./mutations/reservation/createReservationMutation');
const userQuery = require('./queries/user/userQuery');
const roomTypesQuery = require('./queries/room/roomTypesQuery');
const signupMutation = require('./mutations/user/signupMutation');
const confirmEmailMutation = require('./mutations/user/confirmEmailMutation');
const loginMutation = require('./mutations/user/loginMutation');
const cancelReservationMutation = require('./mutations/reservation/cancelReservationMutation');

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            user: userQuery,
            roomTypes: roomTypesQuery,
            availableRoomTypes: availableRoomTypesQuery,
            reservations: reservationsQuery,
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createReservation: createReservationMutation,
            cancelReservation: cancelReservationMutation,
            confirmEmail: confirmEmailMutation,
            signup: signupMutation,
            login: loginMutation,
        }
    })
});

module.exports = { schema };