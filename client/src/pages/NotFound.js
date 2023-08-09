import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className='navbar-spacer vh-100 d-flex flex-column justify-content-center align-items-center'>
            <div className="d-flex flex-column justify-content-center p-2 p-sm-5 blur bg-light bg-opacity-50">
                <div className='d-flex align-items-center'>
                    <FaExclamationTriangle className="m-2 col-2" color='darkred' size={80} />
                    <h1>404 - Not Found</h1>
                </div>
                <p className=''>Sorry, the page you're looking for does not exist.</p>
            </div>
        </div>
    )
}
