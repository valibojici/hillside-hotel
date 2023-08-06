import { gql } from "@apollo/client";

const userFields = gql`
    fragment CoreUserFields on User {
        id
        username
        password
        email
        role
        createdAt
        updatedAt
    }
`

const roomFields = gql`
    fragment CoreRoomFields on Room {
        id
        roomTypeId
        roomNumber
        createdAt
        updatedAt
    }
`
const roomTypeFields = gql`
    fragment CoreRoomTypeFields on RoomType {
        id
        name
        description
        price
        createdAt
        updatedAt
    }
`

const reservationFields = gql`
    fragment CoreReservationFields on Reservation {
        id
        roomId
        userId
        checkIn
        checkOut
        createdAt
        total
        status
        createdAt
        updatedAt
    }
`;

const CREATE_USER = gql`
    ${userFields}
    mutation CreateUser($username: String!, $password: String!, $email: String!, $role: UserRole!){
        createUser(username: $username, password: $password, email: $email, role: $role){
            ...CoreUserFields
        }
    }
`;

const UPDATE_USER = gql`
    ${userFields}
    mutation UpdateUser($id: ID!, $password: String, $username: String, $email: String, $role: UserRole){
        updateUser(id: $id, password: $password, username: $username, role: $role, email: $email){
            ...CoreUserFields
        }
    }
`;

const DELETE_USER = gql`
    mutation DeleteUser($id: ID!){
        deleteUser(id: $id){
            id
        }
    }
`;

const CREATE_ROOM = gql`
    ${roomFields}
    mutation CreateRoom($roomTypeId: ID!, $roomNumber: Int!){
        createRoom(roomTypeId: $roomTypeId, roomNumber: $roomNumber){
            ...CoreRoomFields
        }
    }
`;

const UPDATE_ROOM = gql`
    ${roomFields}
    mutation UpdateRoom($id: ID!, $roomTypeId: ID, $roomNumber: Int){
        updateRoom(id: $id, roomTypeId: $roomTypeId, roomNumber: $roomNumber){
            ...CoreRoomFields
        }
    }
`;

const DELETE_ROOM = gql`
    mutation DeleteRoom($id: ID!){
        deleteRoom(id: $id){
            id
        }
    }
`;

const CREATE_ROOMTYPE = gql`
    ${roomTypeFields}
    mutation CreateRoomType($name: String!, $description: String!, $price: Int!){
        createRoomType(name: $name, description: $description, price: $price){
            ...CoreRoomTypeFields
        }
    }
`;

const UPDATE_ROOMTYPE = gql`
    ${roomTypeFields}
    mutation UpdateRoomType($id: ID!, $name: String, $description: String, $price: Int){
        updateRoomType(id: $id, name: $name, description: $description, price: $price){
            ...CoreRoomTypeFields
        }
    }
`;

const DELETE_ROOMTYPE = gql`
    mutation DeleteRoomType($id: ID!){
        deleteRoomType(id: $id){
            id
        }
    }
`;

const CREATE_RESERVATION = gql`
    ${reservationFields}
    mutation CreateReservation($userId: ID!, $roomId: ID!, $checkIn: String!, $checkOut: String!, $total: Int!, $status: ReservationStatus!){
        createReservation(userId: $userId, roomId: $roomId, checkIn: $checkIn, checkOut: $checkOut, total: $total, status: $status){
            ...CoreReservationFields
        }
    }
`;

const UPDATE_RESERVATION = gql`
    ${reservationFields}
    mutation UpdateReservation($id: ID!, $userId: ID, $roomId: ID, $checkIn: String, $checkOut: String, $total: Int, $status: ReservationStatus){
        updateReservation(id: $id, userId: $userId, roomId: $roomId, checkIn: $checkIn, checkOut: $checkOut, total: $total, status: $status){
            ...CoreReservationFields
        }
    }
`;

const DELETE_RESERVATION = gql`
    mutation DeleteReservation($id: ID!){
        deleteReservation(id: $id){
            id
        }
    }
`;

export {
    CREATE_USER, UPDATE_USER, DELETE_USER,
    CREATE_ROOM, UPDATE_ROOM, DELETE_ROOM,
    CREATE_ROOMTYPE, UPDATE_ROOMTYPE, DELETE_ROOMTYPE,
    CREATE_RESERVATION, UPDATE_RESERVATION, DELETE_RESERVATION
};