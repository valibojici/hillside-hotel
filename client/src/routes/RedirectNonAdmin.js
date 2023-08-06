import { useContext } from "react"
import { LoginContext } from "../App"
import { Navigate, Outlet } from "react-router-dom";

export default function RedirectNonAdmin({ to }) {
    const { user } = useContext(LoginContext);
    return user?.role !== 'admin' ? <Navigate to={to} replace /> : <Outlet />;
}
