import React, { } from 'react'
import LoginForm from '../components/LoginForm';

export default function Login() {
    return (
        <div className='navbar-spacer d-flex justify-content-center'>
            <div className='text-dark my-4 p-3 m-md-5 blur p-md-4 bg-light bg-opacity-50 container col col-md-8 col-lg-6' >
                <h1 className='mb-4'>Login</h1>
                <LoginForm />
            </div>
        </div>
    )
}
