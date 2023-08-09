import React from 'react'
import { FaCheck, FaCheckCircle } from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';

export default function ReservationPayment() {
    const urlParams = new URLSearchParams(window.location.search);
    const canceled = urlParams.get('canceled');
    const success = urlParams.get('success');

    if (canceled) {
        return <div className='navbar-spacer'>
            <div className='container mt-5 d-flex justify-content-center'>
                <div className='bg-light bg-opacity-50 blur p-1 p-4 col-12 col-md-8'>
                    <h1>Reservation not confirmed</h1>
                    <div>The payment has not been completed. We have send you an email with the payment link. Please access it 30 minutes or the reservation is canceled.</div>
                    <div>You can also cancel your reservation from your <Link className='link-primary' to='/profile' >profile</Link></div>
                </div>
            </div>
        </div>
    }

    if (success) {
        return <div className='navbar-spacer'>
            <div className='container mt-5 d-flex justify-content-center p-0 p-sm-2'>
                <div className='bg-light blur bg-opacity-50 py-3 px-1 p-sm-3 p-sm-5 col-lg-6 col-md-8 col-12'>
                    <div className='d-flex text-success align-items-center justify-content-evenly'>
                        <FaCheckCircle className='d-none d-sm-block h1' />
                        <h3 className='text-center'>Reservation confirmed</h3>
                    </div>
                    <div className='mt-4 text-center'>Thank you for your reservation, see you soon.</div>
                </div>
            </div>
        </div>
    }

    return (
        <Navigate to='/' />
    )
}