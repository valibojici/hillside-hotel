import SignupForm from '../components/SignupForm';
import ConfirmEmail from '../components/ConfirmEmail';
import { Link } from 'react-router-dom';

export default function Signup() {
    const token = new URLSearchParams(document.location.search).get('token');

    return (
        <div className='navbar-spacer d-flex justify-content-center'>
            <div className='text-dark my-4 p-3 m-md-5 blur p-md-4 bg-light bg-opacity-50 container col col-md-8 col-lg-6' >
                <h1 className='mb-4'>Signup</h1>
                {token && <SignupForm token={token} />}
                {!token &&
                    <>
                        <ConfirmEmail />
                        <div className='d-flex gap-2 mt-3 flex-column flex-sm-row'>
                            <span>Already have an account?</span>
                            <Link className='' to='/login'>Log in instead.</Link>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
