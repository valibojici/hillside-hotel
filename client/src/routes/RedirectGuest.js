import { useContext } from "react"
import { LoginContext } from "../App"
import { Navigate, Outlet } from "react-router-dom";

export default function RedirectGuest({ to }) {
    const { user } = useContext(LoginContext);
    return !user ? <Navigate to={to} replace /> : <Outlet />;
}
