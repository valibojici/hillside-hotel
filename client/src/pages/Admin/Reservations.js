import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GET_RESERVATIONS } from '../../queries/admin/query';
import { CREATE_RESERVATION, UPDATE_RESERVATION, DELETE_RESERVATION } from '../../mutations/admin/mutation';
import { formatTimestamps, toTimestamps } from '../../services/date';
import Error from '../../components/Error';
import Loading from '../../components/Loading';
import AddModal from '../../components/AddModal';
import DeleteModal from '../../components/DeleteModal';
import EditModal from '../../components/EditModal';

export default function RoomTypes() {
    const { data, loading, error } = useQuery(GET_RESERVATIONS);
    const [deleteRow, setDeleteRow] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const [textWrapRow, setTextWrapRow] = useState(null);

    const [createReservation, { loading: createLoading, error: createError, reset: createReset }] = useMutation(CREATE_RESERVATION, {
        update(cache, { data: { createReservation } }) {
            cache.modify({
                fields: {
                    reservations(existingReservationRefs = []) {
                        const newRef = cache.writeFragment({
                            data: createReservation,
                            fragment: gql`fragment NewReservation on Reservation { id userId roomId checkIn checkOut createdAt total status createdAt updatedAt }`
                        })
                        return [...existingReservationRefs, newRef];
                    }
                }
            })
        }
    });

    const [updateReservation, { loading: updateLoading, error: updateError, reset: updateReset }] = useMutation(UPDATE_RESERVATION);

    const [deleteReservation, { loading: deleteLoading, error: deleteError, reset: deleteReset }] = useMutation(DELETE_RESERVATION, {
        update(cache, { data: { deleteReservation } }) {
            cache.evict({
                id: cache.identify({ ...deleteReservation })
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

    const reservations = data.reservations.map(obj => formatTimestamps(obj));
    const attributes = Object.keys(reservations[0]).filter(key => !(['id', '__typename'].includes(key)))

    const _deleteReservation = (id) => {
        setEditRow(null);
        deleteReservation({
            variables: { id: id }
        })
            .then(_ => window.bootstrap.Modal.getInstance('#deleteModal').hide())
            .catch(err => console.log(err.message));
    }

    const _updateReservation = (attributes) => {
        attributes = toTimestamps(attributes);
        updateReservation({
            variables: { ...attributes },
            onCompleted: () => setEditRow(null)
        })
            .then(_ => window.bootstrap.Modal.getInstance('#editModal').hide())
            .catch(err => console.log(err));
    }

    const _createReservation = (attributes) => {
        attributes = toTimestamps(attributes);
        createReservation({
            variables: { ...attributes },
        })
            .then(_ => window.bootstrap.Modal.getInstance('#addModal').hide())
            .catch(err => console.log(err));
    }

    return (
        <div className='d-flex align-items-center flex-column'>
            <div className='col-11 bg-light mt-4 bg-opacity-50 blur p-3'>
                <h1>Reservations</h1>
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
                        {reservations.map((entry, index) =>
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
            <AddModal error={createError} loading={createLoading} fields={attributes} onSave={_createReservation} onCancel={createReset} />
            <DeleteModal loading={deleteLoading} onConfirm={() => {
                deleteReset();
                _deleteReservation(reservations[deleteRow]?.id);
            }} error={deleteError} />
            <EditModal loading={updateLoading} error={updateError} data={reservations[editRow] || {}} onSave={_updateReservation} onCancel={() => {
                updateReset();
                setEditRow(null);
            }} />
        </div>
    )
}
