import { useEffect, useState } from "react";

export default function AddModal({ fields, error, loading, onSave = () => { }, onCancel = () => { } }) {
    const [attributes, setAttributes] = useState({});

    useEffect(() => {
        setAttributes(Object.fromEntries(fields.filter(key => !(['id', '__typename', 'createdAt', 'updatedAt'].includes(key))).map(e => [e, ''])));
    }, [JSON.stringify([...fields].sort())])


    const handleSubmit = (e) => {
        e.preventDefault();
        function makeInt(key, val) {
            if (['checkIn', 'checkOut', 'password'].includes(key)) return val;
            return (/^\d+$/.test(val)) ? parseInt(val) : val;
        }
        onSave(Object.fromEntries(Object.entries(attributes).map(([key, val]) => [key, makeInt(key, val)])));
    }

    return (
        <div className="modal fade" id="addModal" tabIndex={-1} aria-labelledby="addModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="addModalLabel">Create new entry</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className='d-flex flex-column align-items-center'>
                            {Object.keys(attributes).map(key =>
                                <div className='col-12' key={`${key}`}>
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

                        </form>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary' disabled={loading} onClick={handleSubmit}>Create</button>
                        <button className='btn btn-danger' onClick={onCancel} disabled={loading} data-bs-dismiss="modal"  >Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
