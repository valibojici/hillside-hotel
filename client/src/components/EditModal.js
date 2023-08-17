import React, { useEffect, useState } from 'react'

export default function EditModal({ data, onSave = () => { }, onCancel = () => { }, loading, error }) {
    const { id, __typename, createdAt, updatedAt, ...rest } = data;
    const [attributes, setAttributes] = useState(rest);
    const [parsingBase64, setParsingBase64] = useState(false);

    const filterUnchangedAttributes = (attributes) => {
        return Object.fromEntries(Object.entries(attributes).filter(([key, _]) => attributes[key] !== rest[key]))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        function makeInt(key, val) {
            if (['checkIn', 'checkOut', 'password'].includes(key)) return val;
            return (/^\d+$/.test(val)) ? parseInt(val) : val;
        }
        const newAttributes = Object.fromEntries(Object.entries(attributes).map(([key, val]) => [key, makeInt(key, val)]));
        onSave({ id, ...filterUnchangedAttributes(newAttributes) });
    }

    useEffect(() => {
        setAttributes(data);
    }, [data])

    const handleImageInput = (key, e) => {
        const file = e.target.files[0];
        console.log(file);
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setAttributes((prev) => ({
                ...prev,
                [key]: reader.result
            }));
            setParsingBase64(false);
        };

        setParsingBase64(true);
        reader.readAsDataURL(file);
    }

    return (
        <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="editModalLabel">Edit entry</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className='d-flex flex-column align-items-center'>
                            {Object.keys(rest).map(key => {
                                return <div className='col-12' key={`${id}-${key}`}>
                                    <label className='form-label' htmlFor={key}>{key}</label>
                                    {
                                        key === 'image' ?
                                            <input className='form-control' disabled={parsingBase64} type="file" id={key} onChange={(e) => handleImageInput(key, e)} />
                                            :
                                            <textarea rows={1} className='form-control' type="text" id={key} name={key} value={attributes[key] ?? ''} onChange={(e) => setAttributes((prevAttributes) => ({ ...prevAttributes, [key]: e.target.value }))} />
                                    }
                                </div>;
                            }
                            )}
                            {error &&
                                <div className="mt-2 col-auto">
                                    <span className="text-danger form-text fw-bold">
                                        {error.message}
                                    </span>
                                </div>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-primary' disabled={loading} onClick={handleSubmit}>Save</button>
                        <button className='btn btn-danger' onClick={onCancel} disabled={loading} data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>

    );
}
