import { Link, Outlet } from "react-router-dom"
import Logout from "./Logout";

export default function AdminNavbar() {
    return (
        <>
            <nav className={`navbar  navbar-expand-md bg-light`}>
                <div className="container-fluid mx-3  my-2">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to='/admin/users'>Users</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/admin/rooms'>Rooms</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/admin/roomtypes'>Room types</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/admin/reservations'>Reservations</Link>
                            </li>
                            <Logout />
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>);
}
