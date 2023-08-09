import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GET_USERS } from '../../queries/admin/query';
import { CREATE_USER, DELETE_USER, UPDATE_USER } from '../../mutations/admin/mutation';
import { formatTimestamps } from '../../services/date';
import DeleteModal from '../../components/DeleteModal';
import EditModal from '../../components/EditModal';
import AddModal from '../../components/AddModal';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

export default function Users() {
    const { data, loading, error } = useQuery(GET_USERS);
    const [deleteRow, setDeleteRow] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const [textWrapRow, setTextWrapRow] = useState(null);

    const [addUser, { loading: createLoading, error: createError, reset: addReset }] = useMutation(CREATE_USER, {
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

    const [editUser, { loading: editLoading, error: editError, reset: editReset }] = useMutation(UPDATE_USER);

    const [deleteUser, { loading: deleteLoading, error: deleteError, reset: deleteReset }] = useMutation(DELETE_USER, {
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
        return <Error message={error.message} />;
    }

    if (loading || !data) {
        return <Loading />
    }

    const users = data.users.map(obj => formatTimestamps(obj));
    const attributes = Object.keys(users[0]).filter(key => !(['id', '__typename'].includes(key)))

    const removeUser = (id) => {
        setEditRow(null);
        deleteUser({
            variables: { id: id }
        })
            .then(_ => window.bootstrap.Modal.getInstance('#deleteModal').hide())
            .catch(err => console.log(err.message));
    }

    const updateUser = (attributes) => {
        editUser({
            variables: { ...attributes },
            onCompleted: () => setEditRow(null)
        })
            .then(data => window.bootstrap.Modal.getInstance('#editModal').hide())
            .catch(err => console.log(err));
    }

    const createUser = (attributes) => {
        addUser({
            variables: { ...attributes },
        })
            .then(data => window.bootstrap.Modal.getInstance('#addModal').hide())
            .catch(err => console.log(err));
    }

    if (users.length === 0) {
        return <div>
            <h1>Users</h1>
            <div>No entries...</div>
        </div>
    }

    return (
        <div className='d-flex align-items-center flex-column'>
            <div className='col-11 bg-light mt-4 bg-opacity-50 blur p-3'>
                <h1>Users</h1>
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
                        {users.map((entry, index) =>
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
            <AddModal error={createError} loading={createLoading} fields={attributes} onSave={createUser} onCancel={() => addReset()} />
            <DeleteModal loading={deleteLoading} onConfirm={() => {
                deleteReset();
                removeUser(users[deleteRow]?.id);
            }} error={deleteError} />
            <EditModal loading={editLoading} error={editError} data={users[editRow] || {}} onSave={updateUser} onCancel={() => {
                editReset();
                setEditRow(null);
            }} />
        </div>
    )
}
