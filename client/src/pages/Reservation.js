import { useLazyQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useContext, useEffect, useState } from 'react';
import { GET_AVAILABLE_ROOM_TYPES } from '../queries/query';
import SelectRoomType from '../components/SelectRoomType';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { LoginContext } from '../App';

export default function Reservation() {
    const { logout } = useContext(LoginContext);

    const [checkIn, setCheckIn] = useState(DateTime.now().toUTC().startOf('day').plus({ days: 1 }));
    const [checkOut, setCheckOut] = useState(checkIn.plus({ days: 1 }));
    const [roomType, setRoomType] = useState(null);
    const navigate = useNavigate();

    const [availableRoomTypes, { data, error, loading }] = useLazyQuery(GET_AVAILABLE_ROOM_TYPES, {
        fetchPolicy: 'network-only'
    });

    const updateCheckIn = (e) => {
        const newCheckin = DateTime.fromISO(e.target.value, { zone: 'utc' }).startOf('day');
        setCheckIn(newCheckin);
        if (checkOut <= newCheckin) {
            setCheckOut(newCheckin.plus({ days: 1 }).toUTC());
        }
    }

    useEffect(() => {
        if (error?.message === 'Unauthenticated') {
            logout();
        }
        setRoomType(null);
    }, [data, error, logout])

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate({ pathname: '/reservation/summary', search: createSearchParams({ checkIn, checkOut, roomType }).toString() });
    }

    const loadRooms = (e) => {
        e.preventDefault();
        availableRoomTypes({
            variables: {
                checkIn: checkIn.toMillis().toString(),
                checkOut: checkOut.toMillis().toString()
            }
        }).catch(err => console.log(err));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="checkin">Check In</label>
                <input onChange={updateCheckIn} value={checkIn.toISODate()} min={DateTime.now().toUTC().startOf('day').plus({ days: 1 }).toISODate()} type="date" name="checkin" id="reservation_checkin" />
                <label htmlFor="checkin">Check Out</label>
                <input min={checkIn.plus({ days: 1 }).toISODate()} onChange={e => setCheckOut(DateTime.fromISO(e.target.value, { zone: 'utc' }))} value={checkOut.toISODate()} type="date" name="checkout" id="reservation_checkout" />
                <button disabled={loading} onClick={loadRooms}>Check rooms</button>
                {error && <div style={{ color: 'red' }}>{error.message}</div>}
                {
                    data && data.availableRoomTypes.map(type => <SelectRoomType key={type.id} type={type} setRoomType={setRoomType} />)
                }
                {
                    roomType && <button type="submit">Continue</button>
                }
            </form>
        </div>
    )
}
