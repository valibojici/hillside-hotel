import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GET_ROOMS } from '../../queries/admin/query';
import { CREATE_ROOM, DELETE_ROOM, UPDATE_ROOM } from '../../mutations/admin/mutation';
import { formatTimestamps } from '../../services/date';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import AddModal from '../../components/AddModal';
import DeleteModal from '../../components/DeleteModal';
import EditModal from '../../components/EditModal';

export default function RoomTypes() {
    const { data, loading, error } = useQuery(GET_ROOMS);
    const [deleteRow, setDeleteRow] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const [textWrapRow, setTextWrapRow] = useState(null);

    const [createRoom, { loading: createLoading, error: createError, reset: createReset }] = useMutation(CREATE_ROOM, {
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

    const [updateRoom, { loading: updateLoading, error: updateError, reset: updateReset }] = useMutation(UPDATE_ROOM);

    const [deleteRoom, { loading: deleteLoading, error: deleteError, reset: deleteReset }] = useMutation(DELETE_ROOM, {
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
        return <Error message={error.message} />;
    }

    if (loading || !data) {
        return <Loading />
    }


    const rooms = data.rooms.map(obj => formatTimestamps(obj));
    const attributes = Object.keys(rooms[0]).filter(key => !(['id', '__typename'].includes(key)))

    const _deleteRoom = (id) => {
        setEditRow(null);
        deleteRoom({
            variables: { id: id }
        })
            .then(_ => window.bootstrap.Modal.getInstance('#deleteModal').hide())
            .catch(err => console.log(err.message));
    }

    const _updateRoom = (attributes) => {
        updateRoom({
            variables: { ...attributes },
            onCompleted: () => setEditRow(null)
        })
            .then(_ => window.bootstrap.Modal.getInstance('#editModal').hide())
            .catch(err => console.log(err));
    }

    const _createRoom = (attributes) => {
        createRoom({
            variables: { ...attributes },
        })
            .then(_ => window.bootstrap.Modal.getInstance('#addModal').hide())
            .catch(err => console.log(err));
    }

    return (
        <div className='d-flex align-items-center flex-column'>
            <div className='col-11 bg-light mt-4 bg-opacity-50 blur p-3'>
                <h1>Rooms</h1>
                <button type="button" className="btn btn-info my-3" data-bs-toggle="modal" data-bs-target="#addModal">Create</button>
                <table className='table table-light'>
                    <thead className='text-center'>
                        <tr className=''>
                            <th className='' colSpan={2}>Actions</th>
                            <th>ID</th>
                            {attributes.map(e => <th key={e}>{e}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((entry, index) =>
                            <tr key={entry.id} className=''>
                                <td colSpan={2} className=''>
                                    <div className='d-flex gap-1 justify-content-center'>
                                        <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeleteRow(index)}>Delete</button>
                                        <button type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => setEditRow(index)}>Edit</button>
                                    </div>
                                </td>
                                <td className='text-center'>{entry.id}</td>
                                {attributes.map(e =>
                                    <td style={{ maxWidth: '100px' }} className='text-center' key={`${entry.id}-${e}`}>
                                        <div onClick={(e) => setTextWrapRow((prev) => prev === entry.id ? null : entry.id)} className={`text-wrap ${entry.id === textWrapRow ? 'text-break' : 'overflow-hidden'} `}>{entry[e]}</div>
                                    </td>)}
                            </tr>)}
                    </tbody>
                </table>
            </div>
            <AddModal error={createError} loading={createLoading} fields={attributes} onSave={_createRoom} onCancel={createReset} />
            <DeleteModal loading={deleteLoading} onConfirm={() => {
                deleteReset();
                _deleteRoom(rooms[deleteRow]?.id);
            }} error={deleteError} />
            <EditModal loading={updateLoading} error={updateError} data={rooms[editRow] || {}} onSave={_updateRoom} onCancel={() => {
                updateReset();
                setEditRow(null);
            }} />
        </div>
    )
}
