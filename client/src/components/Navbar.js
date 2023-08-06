import { Link, Outlet } from "react-router-dom"
import { useContext } from "react"
import { LoginContext } from "../App"
import Logout from "./Logout";

export default function Navbar() {
    const { user } = useContext(LoginContext);

    return (
        <>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
            <Link to='/rooms'>Rooms</Link>
            {
                user &&
                <>
                    <Link to='/profile'>Profile</Link>
                    <Link to='/reservation'>Reservation</Link>
                    <Logout />
                </>
            }
            {
                !user &&
                <>
                    <Link to='/login'>Login</Link>
                    <Link to='/signup'>Signup</Link>
                </>
            }
            <Outlet />
        </>
    )
}
