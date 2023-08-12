import { gql } from "@apollo/client";

const GET_USERS = gql`
    query Users {
        users{ id username password email role createdAt updatedAt}
    }
`;

const GET_ROOMS = gql`
    query Rooms {
        rooms { id roomNumber roomTypeId createdAt updatedAt }
    }
`;

const GET_ROOM_TYPES = gql`
    query RoomTypes {
        roomTypes { id name description price image createdAt updatedAt }
    }
`;

const GET_RESERVATIONS = gql`
    query Reservations {
        reservations { id userId roomId checkIn checkOut createdAt total status createdAt updatedAt}
        
    }
`


export { GET_USERS, GET_ROOM_TYPES, GET_ROOMS, GET_RESERVATIONS };