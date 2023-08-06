import { useMutation } from "@apollo/client";
import { useState } from "react"
import { SIGNUP } from "../mutations/mutation";
import { Link } from "react-router-dom";

export default function SignupForm({ token }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [signupUser, { error, loading, data }] = useMutation(SIGNUP, {
        context: {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        signupUser({
            variables: {
                username: username,
                password: password
            }
        }).catch(err => console.log(err.message));
    }

    if (data) {
        return <div>
            <div>Signup successful!</div>
            <Link to='/login'>Please login</Link>
        </div>
    }

    return (
        <>
            <div>Please enter your account details below:</div>
            <form onSubmit={handleSubmit}>
                <input onChange={(e) => setUsername(e.target.value)} value={username} maxLength={255} required type="text" name="username" id="signup_username" />
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" name="password" id="signup_password" />
                <button disabled={loading} type="submit">Sign up</button>
            </form>
            {error &&
                <div style={{ color: 'red' }} >{error.message}</div>
            }
        </>
    )
}
