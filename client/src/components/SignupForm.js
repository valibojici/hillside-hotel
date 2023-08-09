import { useMutation } from "@apollo/client";
import { useRef, useState } from "react"
import { SIGNUP } from "../mutations/mutation";
import { Link } from "react-router-dom";

export default function SignupForm({ token }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [signupUser, { error, loading, data }] = useMutation(SIGNUP, {
        context: {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confirmPassword !== password) {
            setPasswordsMatch(false);
            return;
        }
        setPasswordsMatch(true);

        signupUser({
            variables: {
                username: username,
                password: password
            }
        }).catch(err => console.log(err.message));
    }

    if (data) {
        return <div className="d-flex gap-3 align-items-center flex-column flex-md-row">
            <div>Signup successful!</div>
            <Link to='/login' className="btn btn-primary btn-sm">Please login</Link>
        </div>
    }

    return (
        <>
            <div className="text-center">Please enter your account details below:</div>
            <form onSubmit={handleSubmit} className='d-flex flex-column align-items-stretch align-items-sm-center'>
                <div className='col col-md-8 col-lg-6 my-2'>
                    <label htmlFor="signup_username" className='form-label' >Username</label>
                    <input className="form-control" onChange={(e) => setUsername(e.target.value)} value={username} maxLength={255} required type="text" name="username" id="signup_username" />
                </div>
                <div className='col col-md-8 col-lg-6 my-2'>
                    <label htmlFor="signup_password" className='form-label'>Password</label>
                    <input className="form-control" onChange={(e) => setPassword(e.target.value)} value={password} type="password" name="password" id="signup_password" />
                </div>
                <div className='col col-md-8 col-lg-6 my-2'>
                    <label htmlFor="signup_confirmpassword" className='form-label'>Confirm password</label>
                    <input className="form-control" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" name="password" id="signup_confirmpassword" />
                </div>
                {(!passwordsMatch || error) &&
                    <div className="mt-2 col-auto">
                        <span className="text-danger form-text fw-bold">
                            {passwordsMatch ? error.message : "Passwords do not match."}
                        </span>
                    </div>
                }
                <button disabled={loading} type="submit" className="mt-4 btn btn-primary col-sm-4 col">Sign up</button>
            </form>
        </>
    )
}
