import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GET_USERS } from '../../queries/admin/query';
import AddEntity from '../../components/AddEntity';
import { CREATE_USER, DELETE_USER, UPDATE_USER } from '../../mutations/admin/mutation';
import EditEntity from '../../components/EditEntity';
import { formatTimestamps } from '../../services/date';

export default function Users() {
    const { data, loading, error } = useQuery(GET_USERS);
    const [editRow, setEditRow] = useState(null);

    const [addUser, { loading: createLoading, error: createError }] = useMutation(CREATE_USER, {
        update(cache, { data: { addUser } }) {
            cache.modify({
                fields: {
                    users(existingUsersRefs = []) {
                        const newRef = cache.writeQuery({
                            data: addUser,
                            query: GET_USERS
                        })
                        return [...existingUsersRefs, newRef];
                    }
                }
            })
        }
    });

    const [editUser, { loading: editLoading, error: editError }] = useMutation(UPDATE_USER);

    const [deleteUser, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_USER, {
        update(cache, { data: { deleteUser } }) {
            cache.evict({
                id: cache.identify({ ...deleteUser })
            });
            cache.modify({
                fields: {
                    reservations(existingRefs = [], { readField }) {
                        return existingRefs.filter(ref => readField('userId', ref) !== deleteUser.id);
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
            editError?.networkError?.response?.status || null,
            deleteError?.networkError?.response?.status || null,
        ]
        if (status.includes(403)) {
            navigate('/');
        }
    }, [error, createError, editError, deleteError, navigate])

    if (error) {
        return <div>{error.message}</div>
    }

    if (loading || !data) {
        return <div>Loading...</div>
    }

    const users = data.users.map(obj => formatTimestamps(obj));
    const attributes = Object.keys(users[0]).filter(key => !(['id', '__typename'].includes(key)))

    const removeUser = (id) => {
        setEditRow(null);
        deleteUser({
            variables: { id: id }
        }).catch(err => console.log(err.message));
    }

    const updateUser = (attributes) => {
        editUser({
            variables: { ...attributes },
            onCompleted: () => setEditRow(null)
        }).catch(err => console.log(err));
    }

    const createUser = (attributes) => {
        addUser({
            variables: { ...attributes },
        }).catch(err => console.log(err));
    }

    return (
        <div>

            <h1>Users</h1>
            {
                users.length === 0 && <div>No entries...</div>
            }
            {
                users.length > 0 &&
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>Actions</th>
                            <th>ID</th>
                            {attributes.map(e => <th key={e}>{e}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((entry, index) =>
                            <tr key={entry.id}>
                                <td> <button disabled={deleteLoading} onClick={() => removeUser(entry.id)} >Delete</button> </td>
                                <td> <button disabled={editRow !== null || editLoading} onClick={() => setEditRow(index)} >Edit</button> </td>
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
                    <AddEntity error={createError} loading={createLoading} fields={attributes} onSave={createUser} /> :
                    <EditEntity loading={editLoading} error={editError} data={users[editRow]} onSave={updateUser} onCancel={() => setEditRow(null)} />
            }
        </div>
    )
}
