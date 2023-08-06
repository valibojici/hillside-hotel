import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GET_ROOMS } from '../../queries/admin/query';
import AddEntity from '../../components/AddEntity';
import { CREATE_ROOM, DELETE_ROOM, UPDATE_ROOM } from '../../mutations/admin/mutation';
import EditEntity from '../../components/EditEntity';
import { formatTimestamps } from '../../services/date';

export default function RoomTypes() {
    const { data, loading, error } = useQuery(GET_ROOMS);
    const [editRow, setEditRow] = useState(null);

    const [createRoom, { loading: createLoading, error: createError }] = useMutation(CREATE_ROOM, {
        update(cache, { data: { createRoom } }) {
            cache.modify({
                fields: {
                    rooms(existingRoomsRefs = []) {
                        const newRef = cache.writeFragment({
                            data: createRoom,
                            fragment: gql`fragment NewRoom on Room { id roomNumber roomTypeId createdAt updatedAt }`
                        })
                        return [...existingRoomsRefs, newRef];
                    }
                }
            })
        }
    });

    const [updateRoom, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_ROOM);

    const [deleteRoom, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_ROOM, {
        update(cache, { data: { deleteRoom } }) {
            cache.evict({
                id: cache.identify({ ...deleteRoom })
            });
            cache.modify({
                fields: {
                    reservation(existingRefs = [], { readField }) {
                        return existingRefs.filter(ref => readField('roomId', ref) !== deleteRoom.id);
                    }
                }
            });
            cache.gc();
        }
    });


    const navigate = useNavigate();
    useEffect(() => {
        const status = [
            error?.networkError?.response?.status || null,
            createError?.networkError?.response?.status || null,
            updateError?.networkError?.response?.status || null,
            deleteError?.networkError?.response?.status || null,
        ]
        if (status.includes(403)) {
            navigate('/');
        }
    }, [error, createError, updateError, deleteError, navigate])

    if (error) {
        return <div>{error.message}</div>
    }

    if (loading || !data) {
        return <div>Loading...</div>
    }

    const rooms = data.rooms.map(obj => formatTimestamps(obj));
    const attributes = Object.keys(rooms[0]).filter(key => !(['id', '__typename'].includes(key)))

    const _deleteRoom = (id) => {
        setEditRow(null);
        deleteRoom({
            variables: { id: id }
        }).catch(err => console.log(err.message));
    }

    const _updateRoom = (attributes) => {
        updateRoom({
            variables: { ...attributes },
            onCompleted: () => setEditRow(null)
        }).catch(err => console.log(err));
    }

    const _createRoom = (attributes) => {
        createRoom({
            variables: { ...attributes },
        }).catch(err => console.log(err));
    }

    return (
        <div>

            <h1>Rooms</h1>
            {
                rooms.length === 0 && <div>No entries...</div>
            }
            {
                rooms.length > 0 &&
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>Actions</th>
                            <th>ID</th>
                            {attributes.map(e => <th key={e}>{e}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((entry, index) =>
                            <tr key={entry.id}>
                                <td> <button disabled={deleteLoading} onClick={() => _deleteRoom(entry.id)} >Delete</button> </td>
                                <td> <button disabled={editRow !== null || updateLoading} onClick={() => setEditRow(index)} >Edit</button> </td>
                                <td>{entry.id}</td>
                                {attributes.map(e =>
                                    <td key={`${entry.id}-${e}`}>
                                        {entry[e]}
                                    </td>)}
                            </tr>)}
                    </tbody>
                </table>
            }
            {deleteError && <div style={{ color: 'red' }}>{deleteError.message}</div>}


            {
                editRow === null ?
                    <AddEntity error={createError} loading={createLoading} fields={attributes} onSave={_createRoom} /> :
                    <EditEntity loading={updateLoading} error={updateError} data={rooms[editRow]} onSave={_updateRoom} onCancel={() => setEditRow(null)} />
            }
        </div>
    )
}
