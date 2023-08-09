import React from 'react'

export default function DeleteModal({ onConfirm, error, loading }) {
    return (
        <div className="modal fade" id="deleteModal" tabIndex={1000} aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="deleteModalLabel">Are you sure you want to delete the record?</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className='modal-body'>
                        <div className="mt-2 col-auto">
                            {error && <span className="text-danger fw-bold">
                                {error.message}
                            </span>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button disabled={loading} type="button" className="btn btn-primary" onClick={onConfirm}>Confirm</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
