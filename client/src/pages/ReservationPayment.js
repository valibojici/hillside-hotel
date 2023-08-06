import React from 'react'
import { Link, Navigate } from 'react-router-dom';

export default function ReservationPayment() {
    const urlParams = new URLSearchParams(window.location.search);
    const canceled = urlParams.get('canceled');
    const success = urlParams.get('success');

    if (canceled) {
        return <div>
            <h1>Reservation not confirmed</h1>
            <div>The payment has not been completed. We have send you an email with the payment link. Please access it 30 minutes or the reservation is canceled.</div>
            <div>You can also cancel your reservation from your <Link to='/profile' >profile</Link></div>
        </div>
    }

    if (success) {
        return <div>
            <h1>Reservation confirmed</h1>
            <div>Thank you for your reservation, see you soon.</div>
        </div>
    }

    return (
        <Navigate to='/' />
    )
}