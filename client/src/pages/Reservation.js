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
        <div className='navbar-spacer'>
            <div className='container d-flex my-3 justify-content-center'>
                <form onSubmit={handleSubmit} className='p-3 blur bg-light bg-opacity-50 col col-sm-10 col-lg-7 d-flex flex-column '>
                    <div className='p-2'>
                        Select the check in and check out dates to see which room types are available.
                    </div>
                    <div className='col col-lg-8 align-self-lg-center'>
                        <label className='form-label' htmlFor="checkin">Check In</label>
                        <input className='form-control' onChange={updateCheckIn} value={checkIn.toISODate()} min={DateTime.now().toUTC().startOf('day').plus({ days: 1 }).toISODate()} type="date" name="checkin" id="reservation_checkin" />
                    </div>
                    <div className='col col-lg-8 align-self-lg-center'>
                        <label className='form-label' htmlFor="checkin">Check Out</label>
                        <input className='form-control' min={checkIn.plus({ days: 1 }).toISODate()} onChange={e => setCheckOut(DateTime.fromISO(e.target.value, { zone: 'utc' }))} value={checkOut.toISODate()} type="date" name="checkout" id="reservation_checkout" />
                    </div>
                    <button className='btn btn-primary mt-4 col-12 col-sm-5 align-self-center' disabled={loading} onClick={loadRooms}>Check rooms</button>
                    {
                        error &&
                        <div className="mt-2 text-center">
                            <span className="text-danger form-text fw-bold"> {error.message} </span>
                        </div>
                    }
                    {
                        data &&
                        <div>
                            <h5 className='mt-5 text-center'>Please select a room type</h5>
                            <div className='d-flex gap-3 flex-wrap justify-content-center my-3'>
                                {data.availableRoomTypes.map(type => <SelectRoomType selected={type.id === roomType} key={type.id} type={type} setRoomType={setRoomType} />)}
                            </div>
                        </div>
                    }
                    {
                        roomType && <button className='btn btn-primary col-12 col-sm-5 align-self-center' type="submit">Continue</button>
                    }
                </form>
            </div>
        </div>
    )
}
