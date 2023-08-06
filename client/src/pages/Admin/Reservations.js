import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GET_RESERVATIONS } from '../../queries/admin/query';
import AddEntity from '../../components/AddEntity';
import { CREATE_RESERVATION, UPDATE_RESERVATION, DELETE_RESERVATION } from '../../mutations/admin/mutation';
import EditEntity from '../../components/EditEntity';
import { formatTimestamps, toTimestamps } from '../../services/date';

export default function RoomTypes() {
    const { data, loading, error } = useQuery(GET_RESERVATIONS);
    const [editRow, setEditRow] = useState(null);

    const [createReservation, { loading: createLoading, error: createError }] = useMutation(CREATE_RESERVATION, {
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

    const [updateReservation, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_RESERVATION);

    const [deleteReservation, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_RESERVATION, {
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
        return <div>{error.message}</div>
    }

    if (loading || !data) {
        return <div>Loading...</div>
    }

    const reservations = data.reservations.map(obj => formatTimestamps(obj));
    const attributes = Object.keys(reservations[0]).filter(key => !(['id', '__typename'].includes(key)))

    const _deleteReservation = (id) => {
        setEditRow(null);
        deleteReservation({
            variables: { id: id }
        }).catch(err => console.log(err.message));
    }

    const _updateReservation = (attributes) => {
        attributes = toTimestamps(attributes);
        updateReservation({
            variables: { ...attributes },
            onCompleted: () => setEditRow(null)
        }).catch(err => console.log(err));
    }

    const _createReservation = (attributes) => {
        attributes = toTimestamps(attributes);
        createReservation({
            variables: { ...attributes },
        }).catch(err => console.log(err));
    }

    return (
        <div>

            <h1>Reservations</h1>
            {
                reservations.length === 0 && <div>No entries...</div>
            }
            {
                reservations.length > 0 &&
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>Actions</th>
                            <th>ID</th>
                            {attributes.map(e => <th key={e}>{e}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((entry, index) =>
                            <tr key={entry.id}>
                                <td> <button disabled={deleteLoading} onClick={() => _deleteReservation(entry.id)} >Delete</button> </td>
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
                    <AddEntity error={createError} loading={createLoading} fields={attributes} onSave={_createReservation} /> :
                    <EditEntity loading={updateLoading} error={updateError} data={reservations[editRow]} onSave={_updateReservation} onCancel={() => setEditRow(null)} />
            }
        </div>
    )
}
