import { useContext } from "react"
import { LoginContext } from "../App"
import { Navigate, Outlet } from "react-router-dom";

export default function RedirectUser({ to }) {
    const { user } = useContext(LoginContext);
    return user ? <Navigate to={to} replace /> : <Outlet />;
}
