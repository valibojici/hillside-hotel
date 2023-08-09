import { FaExclamationTriangle } from "react-icons/fa"

export default function Error({ message }) {
    return (
        <div className='container'>
            <div className='px-1 py-3 p-sm-3 p-md-5 blur bg-light bg-opacity-50 mt-4 d-flex flex-column'>
                <div className="text-danger d-flex justify-content-sm-start justify-content-center align-items-center">
                    <div className="">
                        <FaExclamationTriangle size={40} />
                    </div>
                    <div className="mx-3">
                        <h2 className='p-0 m-0'>Error</h2>
                    </div>
                </div>
                <p className="mt-3">
                    {message}
                </p>
            </div>
        </div>
    )
}
