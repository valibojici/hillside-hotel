import { useQuery } from "@apollo/client";
import { GET_ROOM_TYPES } from "../queries/query";
import { DateTime } from 'luxon';
import { Link } from "react-router-dom";
import Payment from "../components/Payment";

export default function ReservationSummary() {
    const urlParams = new URLSearchParams(window.location.search);
    const checkIn = DateTime.fromISO(urlParams.get('checkIn')).toUTC();
    const checkOut = DateTime.fromISO(urlParams.get('checkOut')).toUTC();
    const roomType = urlParams.get('roomType');

    const { data, loading, error } = useQuery(GET_ROOM_TYPES);

    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Something went wrong...</div>
    }

    const room = data.roomTypes.find(r => r.id === roomType);
    const nights = checkOut.diff(checkIn, ['days']).days;
    const total = room.price * nights;

    return (
        <>
            <h1>Reservation Summary</h1>
            <div>Check In: {checkIn.toFormat('dd LLL yyyy')}</div>
            <div>Check Out: {checkOut.toFormat('dd LLL yyyy')}</div>
            <div>Nights: {nights}</div>
            <div>Total: {total / 100}$ ({room.price / 100}$ per night) </div>
            <div>Room type: {room.name}</div>
            <Link to='/reservation'>Go back</Link>
            <Payment {...{ checkIn, checkOut, roomTypeId: roomType }} />
        </>
    )
}
