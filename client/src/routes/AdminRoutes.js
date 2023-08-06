import { Link, Outlet, Route, Routes } from 'react-router-dom'
import Login from '../pages/Admin/Login'
import NotFound from '../pages/NotFound'
import RedirectNonAdmin from './RedirectNonAdmin';
import RedirectAdmin from './RedirectAdmin';
import Home from '../pages/Admin/Home';
import Rooms from '../pages/Admin/Rooms';
import RoomTypes from '../pages/Admin/RoomTypes';
import Reservations from '../pages/Admin/Reservations';
import Users from '../pages/Admin/Users';
import { useContext } from 'react';
import { LoginContext } from '../App';

export default function AdminRoutes() {
    const { logout } = useContext(LoginContext);

    const NavBar = <>
        <Link to='/admin/users'>Users</Link>
        <Link to='/admin/rooms'>Rooms</Link>
        <Link to='/admin/roomtypes'>Room types</Link>
        <Link to='/admin/reservations'>Reservations</Link>
        <button onClick={() => logout()} >Log out</button>
        <Outlet />
    </>

    return (
        <Routes>
            <Route element={<RedirectAdmin to='/admin' />}>
                <Route path='/login' element={<Login />} />
            </Route>

            <Route element={<RedirectNonAdmin to='/admin/login' />}>
                <Route element={NavBar} >
                    <Route index element={<Home />} />
                    <Route path='/users' element={<Users />} />
                    <Route path='/rooms' element={<Rooms />} />
                    <Route path='/roomtypes' element={<RoomTypes />} />
                    <Route path='/reservations' element={<Reservations />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
