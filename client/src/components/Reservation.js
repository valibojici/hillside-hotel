import { useMutation } from '@apollo/client';
import { DateTime } from 'luxon';
import { CANCEL_RESERVATION } from '../mutations/mutation';
import { useContext, useEffect } from 'react';
import { LoginContext } from '../App';

export default function Reservation({ reservation }) {
    const formatDate = (timestamp) => {
        const date = DateTime.fromMillis(parseInt(timestamp));
        return date.toUTC().toFormat('dd LLL yyyy');
    }

    const [cancelReservation, { error, loading }] = useMutation(CANCEL_RESERVATION);

    const { logout } = useContext(LoginContext);
    useEffect(() => {
        if (error?.message === 'Unauthenticated') {
            logout();
        }
    }, [error, logout])

    const handleCancel = (_) => {
        cancelReservation({
            variables: {
                id: reservation.id
            }
        }).catch(error => console.log(error));
    }

    return (
        <div>
            <div className='d-flex flex-column py-2 list-group'>
                <div className='p-1'>Check in: {formatDate(reservation.checkIn)}</div>
                <div className='p-1'>Check out: {formatDate(reservation.checkOut)}</div>
                <div className='p-1'>Total: {reservation.total / 100}$</div>
                <div className='p-1'>Status: {reservation.status}</div>
                <div className='p-1'>
                    <div>Room information:</div>
                    <ul>
                        <li>Room number: {reservation.room.roomNumber}</li>
                        <li>Room type: {reservation.room.roomType.name}</li>
                    </ul>
                </div>
            </div>

            {
                reservation.status === 'pending' &&
                <button className='btn btn-danger btn-sm' onClick={handleCancel} disabled={loading}>Cancel reservation</button>
            }
            {
                error && <div style={{ color: 'red' }} >{error.message}</div>
            }
            <hr />
        </div>
    )
}
