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
            <form action="" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input autoComplete='username' ref={usernameRef} type="text" name="username" id="username" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input autoComplete='current-password' ref={passwordRef} type="password" name="password" id="password" />
                </div>
                <button type="submit" disabled={loading} >Login</button>
                {error ? <p style={{ color: 'red' }}> {error.message} </p> : null}
            </form>
        </div>
    )
}
