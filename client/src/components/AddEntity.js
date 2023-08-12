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
        <form onSubmit={handleSubmit} className='d-flex flex-column align-items-center'>
            {Object.keys(attributes).map(key =>
                <div className='col-10 col-md-5 col-lg-3' key={`${key}`}>
                    <label className='form-label' htmlFor={key}>{key}</label>
                    <input className='form-control' type="text" id={key} value={attributes[key]} onChange={(e) => setAttributes((prev) => ({ ...prev, [key]: e.target.value }))} />
                </div>
            )}
            {error &&
                <div className="mt-2 col-auto">
                    <span className="text-danger form-text fw-bold">
                        {error.message}
                    </span>
                </div>}
            <button className='btn btn-primary mt-3' type="submit" disabled={loading}>Create</button>
        </form>
    )
}
