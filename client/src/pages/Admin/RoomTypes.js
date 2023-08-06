import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GET_RESERVATIONS, GET_ROOM_TYPES } from '../../queries/admin/query';
import AddEntity from '../../components/AddEntity';
import { CREATE_ROOMTYPE, DELETE_ROOMTYPE, UPDATE_ROOMTYPE } from '../../mutations/admin/mutation';
import EditEntity from '../../components/EditEntity';
import { formatTimestamps } from '../../services/date';

export default function RoomTypes() {
    const { data, loading, error } = useQuery(GET_ROOM_TYPES);
    const [editRow, setEditRow] = useState(null);

    const [createRoomType, { loading: createLoading, error: createError }] = useMutation(CREATE_ROOMTYPE, {
        update(cache, { data: { createRoomType } }) {
            cache.modify({
                fields: {
                    roomTypes(existingRoomTypesRefs = []) {
                        const newRef = cache.writeFragment({
                            data: createRoomType,
                            fragment: gql`fragment NewRoomType on RoomType { id name description price createdAt updatedAt }`
                        })
                        return [...existingRoomTypesRefs, newRef];
                    },
                }
            })
        }
    });

    const [updateRoomType, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_ROOMTYPE);

    const [deleteRoomType, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_ROOMTYPE, {
        update(cache, { data: { deleteRoomType } }) {
            cache.evict({
                id: cache.identify({ ...deleteRoomType })
            });
            cache.modify({
                fields: {
                    rooms(existingRoomsRefs = [], { readField }) {
                        return existingRoomsRefs.filter(ref => readField('roomTypeId', ref) !== deleteRoomType.id);
                    }
                }
            })
            cache.gc();
        },
        refetchQueries: [GET_RESERVATIONS]
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

    const roomTypes = data.roomTypes.map(obj => formatTimestamps(obj));
    const attributes = Object.keys(roomTypes[0]).filter(key => !(['id', '__typename'].includes(key)))

    const _deleteRoomType = (id) => {
        setEditRow(null);
        deleteRoomType({
            variables: { id: id }
        }).catch(err => console.log(err.message));
    }

    const _updateRoomType = (attributes) => {
        updateRoomType({
            variables: { ...attributes },
            onCompleted: () => setEditRow(null)
        }).catch(err => console.log(err));
    }

    const _createRoomType = (attributes) => {
        createRoomType({
            variables: { ...attributes },
        }).catch(err => console.log(err));
    }

    return (
        <div>

            <h1>Room Types</h1>
            {
                roomTypes.length === 0 && <div>No entries...</div>
            }
            {
                roomTypes.length > 0 &&
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>Actions</th>
                            <th>ID</th>
                            {attributes.map(e => <th key={e}>{e}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {roomTypes.map((entry, index) =>
                            <tr key={entry.id}>
                                <td> <button disabled={deleteLoading} onClick={() => _deleteRoomType(entry.id)} >Delete</button> </td>
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
                    <AddEntity error={createError} loading={createLoading} fields={attributes} onSave={_createRoomType} /> :
                    <EditEntity loading={updateLoading} error={updateError} data={roomTypes[editRow]} onSave={_updateRoomType} onCancel={() => setEditRow(null)} />
            }
        </div>
    )
}
