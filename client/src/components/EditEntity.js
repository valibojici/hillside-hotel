import React, { useState } from 'react'

export default function EditEntity({ data, onSave = () => { }, onCancel = () => { }, loading, error }) {
    const { id, __typename, createdAt, updatedAt, ...rest } = data;
    const [attributes, setAttributes] = useState(rest);

    const filterUnchangedAttributes = (attributes) => {
        return Object.fromEntries(Object.entries(attributes).filter(([key, value]) => attributes[key] !== rest[key]))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ id, ...filterUnchangedAttributes(attributes) });
    }

    return (
        <form className='d-flex flex-column align-items-center' onSubmit={handleSubmit}>
            {Object.entries(rest).map(([key, val]) =>
                <div className='col-10 col-md-5 col-lg-3' key={`${id}-${key}`}>
                    <label className='form-label' htmlFor={key}>{key}</label>
                    <input className='form-control' type="text" id={key} name={key} value={attributes[key]} onChange={(e) => setAttributes((prevAttributes) => ({ ...prevAttributes, [key]: e.target.value }))} />
                </div>
            )}
            <div className='d-flex gap-2 mt-3'>
                <button className='btn btn-primary' disabled={loading} type='submit'>Save</button>
                <button className='btn btn-danger' onClick={onCancel} disabled={loading} >Cancel</button>
            </div>
            {error && <div style={{ color: 'red' }}>{error.message}</div>}
        </form>
    )
}
