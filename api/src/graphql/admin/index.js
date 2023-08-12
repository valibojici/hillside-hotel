const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const createReservationMutation = require('./mutations/reservation/createReservationMutation');
const deleteReservationMutation = require('./mutations/reservation/deleteReservationMutation');
const updateReservationMutation = require('./mutations/reservation/updateReservationMutation');
const usersQuery = require('./queries/usersQuery');
const roomsQuery = require('./queries/roomsQuery');
const reservationsQuery = require('./queries/reservationsQuery');
const roomTypesQuery = require('./queries/roomTypesQuery');
const createRoomMutation = require('./mutations/room/createRoomMutation');
const updateRoomMutation = require('./mutations/room/updateRoomMutation');
const deleteRoomMutation = require('./mutations/room/deleteRoomMutation');
const createUserMutation = require('./mutations/user/createUserMutation');
const deleteUserMutation = require('./mutations/user/deleteUserMutation');
const updateUserMutation = require('./mutations/user/updateUserMutation');
const createRoomTypeMutation = require('./mutations/roomType/createRoomTypeMutation');
const deleteRoomTypeMutation = require('./mutations/roomType/deleteRoomTypeMutation');
const updateRoomTypeMutation = require('./mutations/roomType/updateRoomTypeMutation');


const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            users: usersQuery,
            rooms: roomsQuery,
            reservations: reservationsQuery,
            roomTypes: roomTypesQuery
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createReservation: createReservationMutation,
            deleteReservation: deleteReservationMutation,
            updateReservation: updateReservationMutation,

            createRoom: createRoomMutation,
            updateRoom: updateRoomMutation,
            deleteRoom: deleteRoomMutation,

            createUser: createUserMutation,
            deleteUser: deleteUserMutation,
            updateUser: updateUserMutation,

            createRoomType: createRoomTypeMutation,
            deleteRoomType: deleteRoomTypeMutation,
            updateRoomType: updateRoomTypeMutation,
        }
    })
});


module.exports = { schema };