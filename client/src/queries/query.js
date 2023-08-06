import { gql } from "@apollo/client";

const GET_ROOM_TYPES = gql`
    query GetRoomTypes{
        roomTypes{
            id
            name
            description
            price
        }
    }
`

const GET_AVAILABLE_ROOM_TYPES = gql`
    query GetAvailableRoomTypes($checkIn: String!, $checkOut: String!){
        availableRoomTypes(checkIn: $checkIn, checkOut: $checkOut){
            id,
            name,
            description,
            price
        }
    }
`

const GET_USER = gql`
    query GetUser($id: ID!){
        user(id: $id){
            id
            username,
            email,
            password,
            role,
            reservations {
                id
                checkIn,
                checkOut,
                total,
                status,
                createdAt
                room {
                    id
                    roomNumber
                    roomType {
                        id
                        name
                    }
                }
            }
        }
    }
`

export { GET_ROOM_TYPES, GET_AVAILABLE_ROOM_TYPES, GET_USER }