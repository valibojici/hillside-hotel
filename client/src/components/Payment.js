import { useMutation } from '@apollo/client'
import React, { useContext, useEffect } from 'react'
import { CREATE_RESERVATION } from '../mutations/mutation'
import { LoginContext } from '../App';

export default function Payment({ checkIn, checkOut, roomTypeId, }) {
    const [createReservation, { loading, error }] = useMutation(CREATE_RESERVATION);

    const { logout } = useContext(LoginContext);
    useEffect(() => {
        if (error?.message === 'Unauthenticated') {
            logout();
        }
    }, [error, logout]);

    const handlePayment = (e) => {
        e.preventDefault();
        createReservation({
            variables: {
                checkIn: checkIn.toMillis().toString(),
                checkOut: checkOut.toMillis().toString(),
                roomTypeId: roomTypeId,
                successUrl: `${process.env.REACT_APP_BASE_URL}/reservation/payment`,
                cancelUrl: `${process.env.REACT_APP_BASE_URL}/reservation/payment`
            },
            onCompleted: (data) => {
                const url = data.createReservation;
                window.location.replace(url);
            }
        }).catch(err => console.log(err));
    }

    return (
        <>
            <button disabled={loading} onClick={handlePayment} >Proceed to payment</button>
            {error && <div style={{ color: 'red' }}>{error.message}</div>}
        </>
    )
}
