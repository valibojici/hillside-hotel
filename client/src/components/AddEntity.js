import { useState } from 'react'

export default function AddEntity({ fields, error, loading, onSave = () => { } }) {
    const [attributes, setAttributes] = useState(() => Object.fromEntries(fields.filter(key => !(['id', '__typename', 'createdAt', 'updatedAt'].includes(key))).map(e => [e, ''])));


    const handleSubmit = (e) => {
        e.preventDefault();
        function makeInt(key, val) {
            if (['checkIn', 'checkOut'].includes(key)) return val;
            return (/^\d+$/.test(val)) ? parseInt(val) : val;
        }
        onSave(Object.fromEntries(Object.entries(attributes).map(([key, val]) => [key, makeInt(key, val)])));
    }

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(attributes).map(key =>
                <div key={`${key}`}>
                    <label htmlFor={key}>{key}</label>
                    <input type="text" id={key} value={attributes[key]} onChange={(e) => setAttributes((prev) => ({ ...prev, [key]: e.target.value }))} />
                </div>
            )}
            <button type="submit" disabled={loading}>Create</button>
            {error && <div style={{ color: 'red' }}>{error.message}</div>}
        </form>
    )
}
