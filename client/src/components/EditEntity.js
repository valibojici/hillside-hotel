import React, { useState } from 'react'

export default function EditEntity({ data, onSave = () => { }, onCancel = () => { }, loading, error }) {
    const { id, __typename, createdAt, updatedAt, ...rest } = data;
    const [attributes, setAttributes] = useState(rest);

    const filterUnchangedAttributes = (attributes) => {
        return Object.fromEntries(Object.entries(attributes).filter(([key, value]) => attributes[key] !== rest[key]))
    }

    return (
        <div>
            {Object.entries(rest).map(([key, val]) =>
                <div key={`${id}-${key}`}>
                    <label htmlFor={key}>{key}</label>
                    <input type="text" id={key} name={key} value={attributes[key]} onChange={(e) => setAttributes((prevAttributes) => ({ ...prevAttributes, [key]: e.target.value }))} />
                </div>
            )}
            <button disabled={loading} onClick={() => onSave({ id, ...filterUnchangedAttributes(attributes) })} >Save</button>
            <button onClick={onCancel} disabled={loading} >Cancel</button>
            {error && <div style={{ color: 'red' }}>{error.message}</div>}
        </div>
    )
}
