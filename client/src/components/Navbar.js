import { Link, Outlet } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { LoginContext } from "../App"
import Logout from "./Logout";
import Footer from "./Footer";

export default function Navbar() {
    const { user } = useContext(LoginContext);

    const [scrollY, setScrollY] = useState(window.scrollY);

    useEffect(() => {
        window.addEventListener('scroll', (e) => setScrollY(window.scrollY));

        return () => {
            window.removeEventListener('scroll', (e) => console.log(e));
        }
    }, [scrollY]);

    return (
        <>
            <nav className={`navbar fixed-top navbar-expand-md bg-light ${scrollY < 25 ? "bg-opacity-75" : ""} opaque`}>
                <div className="container-fluid mx-3  my-2">
                    <Link className="navbar-brand" to='/'>Hillside Hotel</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link to='/' className="nav-link" aria-current="page">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/rooms' className="nav-link" aria-current="page">Rooms</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/about' className="nav-link" aria-current="page">About</Link>
                            </li>
                            {
                                user &&
                                <>
                                    <li className="nav-item">
                                        <Link to='/profile' className="nav-link" aria-current="page">Profile</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/reservation' className="nav-link" aria-current="page">Reservation</Link>
                                    </li>
                                    {/* <li className="nav-item">

                                    </li> */}

                                </>
                            }
                            {
                                !user &&
                                <div className="d-flex ms-3">
                                    <li className="nav-item">
                                        <Link to='/login' className="nav-link" aria-current="page">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/signup' className="nav-link" aria-current="page">Signup</Link>
                                    </li>
                                </div>
                            }
                        </ul>
                        {
                            user && <Logout />
                        }
                    </div>
                </div>
            </nav>
            <Outlet />

            <Footer />
        </>)
}
