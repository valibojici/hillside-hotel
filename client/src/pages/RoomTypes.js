import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ROOM_TYPES } from '../queries/query'
import RoomType from '../components/RoomType';

export default function RoomTypes() {
    const { data, loading, error } = useQuery(GET_ROOM_TYPES);

    if (loading) return <div>Loading...</div>
    if (error) return <div>Something went wrong...</div>

    return (
        <div>
            <h1>Room types</h1>
            {
                data.roomTypes.map(r => <RoomType key={r.id} type={r} />)
            }
        </div>
    )
}
