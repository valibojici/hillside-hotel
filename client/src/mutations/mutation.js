import { gql } from "@apollo/client";

const LOGIN = gql`
    mutation Login($username: String!, $password: String!){
        login(username: $username, password: $password)
    }
`

const CANCEL_RESERVATION = gql`
    mutation CancelReservation($id: ID!){
        cancelReservation(id: $id){
            id,
            status,
        }
    }
`

const CONFIRM_EMAIL = gql`
    mutation ConfirmEmail($email: String!, $url: String!){
        confirmEmail(email: $email, url: $url)
    }
`

const SIGNUP = gql`
    mutation Signup($username: String!, $password: String!){
        signup(username: $username, password: $password){
            id
        }
    }
`

const CREATE_RESERVATION = gql`
    mutation CreateReservation($checkIn: String!, $checkOut: String!, $roomTypeId: ID!, $successUrl: String!, $cancelUrl: String!){
        createReservation(checkIn: $checkIn, checkOut: $checkOut, roomTypeId: $roomTypeId, successUrl: $successUrl, cancelUrl: $cancelUrl)
    }
`

export { LOGIN, CANCEL_RESERVATION, CONFIRM_EMAIL, SIGNUP, CREATE_RESERVATION }