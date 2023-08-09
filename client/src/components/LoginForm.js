import { useMutation } from '@apollo/client';
import React, { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../App';
import { LOGIN } from '../mutations/mutation';
import { client } from '../apolloClient';

export default function LoginForm({ to = '/' }) {
    const navigator = useNavigate();
    const { login } = useContext(LoginContext);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const [loginUser, { loading, error }] = useMutation(LOGIN, { client: client });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await loginUser({
                variables: {
                    username: usernameRef.current.value,
                    password: passwordRef.current.value,
                },
                onCompleted: (data) => {
                    login(data.login);
                    navigator(to);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <form className='d-flex flex-column align-items-stretch align-items-sm-center' onSubmit={handleSubmit}>
                <div className='col col-md-8 col-lg-6 my-2'>
                    <label htmlFor="username" className='form-label' >Username</label>
                    <input className='form-control' autoComplete='username' ref={usernameRef} type="text" name="username" id="username" required />
                </div>
                <div className='col col-md-8 col-lg-6 my-2'>
                    <label htmlFor="password" className='form-label'>Password</label>
                    <input className='form-control' autoComplete='current-password' ref={passwordRef} type="password" name="password" id="password" required />
                </div>
                {
                    error &&
                    <div className="mt-2 col-auto">
                        <span className="text-danger form-text fw-bold">
                            {error.message}
                        </span>
                    </div>
                }
                <button className='mt-4 btn btn-primary col-sm-4 col' type="submit" disabled={loading} >Login</button>
            </form>
        </div>
    )
}
