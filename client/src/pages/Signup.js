import SignupForm from '../components/SignupForm';
import ConfirmEmail from '../components/ConfirmEmail';

export default function Signup() {
    const token = new URLSearchParams(document.location.search).get('token');

    return (
        <>
            <h1>Signup</h1>
            {token && <SignupForm token={token} />}
            {!token && <ConfirmEmail />}
        </>
    )
}
