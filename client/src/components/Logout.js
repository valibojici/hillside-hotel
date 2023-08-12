import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../App";

export default function Logout() {
    const { logout } = useContext(LoginContext);
    const navigate = useNavigate();

    const handleClick = () => {
        logout();
        navigate('/');
    }

    return <button className="btn btn-outline-dark me-5" onClick={handleClick} >Logout</button>
}
