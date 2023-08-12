import LoginForm from "../../components/LoginForm";

export default function Login() {
    return (
        <div className="d-flex container mt-4 justify-content-center">
            <div className="bg-light bg-opacity-50 blur col-5 p-3">
                <h1>Login</h1>
                <LoginForm to="/admin" />
            </div>
        </div>
    )
}
