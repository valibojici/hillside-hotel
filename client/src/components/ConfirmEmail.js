import { useMutation } from "@apollo/client";
import { useState } from "react"
import { CONFIRM_EMAIL } from "../mutations/mutation";

export default function ConfirmEmail() {
    const [email, setEmail] = useState('');
    const [confirmEmail, { data, loading, error }] = useMutation(CONFIRM_EMAIL);

    const handleSubmit = (e) => {
        e.preventDefault();
        confirmEmail({
            variables: {
                email: email,
                url: `${process.env.REACT_APP_BASE_URL}/signup`
            }
        }).catch(err => console.log(err));
    }

    if (data) {
        return <div>Please check your email.</div>
    }

    return (
        <>
            <div>Please confirm your email address before continuing</div>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" id="signup_email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button disabled={loading} type="submit">Send confirmation</button>
            </form>

            {error &&
                <div style={{ color: 'red' }}>{error.message}</div>
            }
        </>
    )
}
