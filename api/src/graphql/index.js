const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const usersQuery = require('./queries/user/usersQuery');
const roomsQuery = require('./queries/room/roomsQuery');
const reservationsQuery = require('./queries/reservation/reservationsQuery');
const availableRoomTypesQuery = require('./queries/room/availableRoomTypesQuery');
const createReservationMutation = require('./mutations/reservation/createReservationMutation');
const userReservationsQuery = require('./queries/reservation/userReservationsQuery');
const userQuery = require('./queries/user/userQuery');
const roomTypesQuery = require('./queries/room/roomTypesQuery');
const roomTypeQuery = require('./queries/room/roomTypeQuery');
const deleteReservationMutation = require('./mutations/reservation/deleteReservationMutation');
const signupMutation = require('./mutations/user/signupMutation');
const confirmEmailMutation = require('./mutations/user/confirmEmailMutation');
const deleteUserMutation = require('./mutations/user/deleteUserMutation');
const loginMutation = require('./mutations/user/loginMutation');

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            users: usersQuery,
            user: userQuery,
            rooms: roomsQuery,
            roomTypes: roomTypesQuery,
            roomType: roomTypeQuery,
            reservations: reservationsQuery,
            availableRoomTypes: availableRoomTypesQuery,
            userReservations: userReservationsQuery,
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createReservation: createReservationMutation,
            deleteReservation: deleteReservationMutation,
            confirmEmail: confirmEmailMutation,
            signup: signupMutation,
            login: loginMutation,
            deleteUser: deleteUserMutation,
        }
    })
});

module.exports = { schema };