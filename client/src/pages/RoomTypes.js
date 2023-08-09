import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ROOM_TYPES } from '../queries/query'
import RoomType from '../components/RoomType';

export default function RoomTypes() {
    const { data, loading, error } = useQuery(GET_ROOM_TYPES);

    if (loading) return <div>Loading...</div>
    if (error) return <div>Something went wrong...</div>

    return (
        <div className='navbar-spacer'>
            <div className='container d-flex mt-5 justify-content-center p-1 p-sm-2 p-md-5'>
                <div className='col-12 blur bg-light p-1 p-md-3 bg-opacity-50'>
                    <h1 className='fancy-text display-5 text-center my-3'>Room Types</h1>
                    {
                        data.roomTypes.map((r, index) => <RoomType key={r.id} index={index} type={r} />)
                    }
                </div>
            </div>
        </div>
    )
}
