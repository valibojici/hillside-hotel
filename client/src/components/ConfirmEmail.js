import { useMutation } from "@apollo/client";
import { useState } from "react"
import { CONFIRM_EMAIL } from "../mutations/mutation";

export default function ConfirmEmail() {
    const [email, setEmail] = useState('');
    const [confirmEmail, { data, loading, error, reset }] = useMutation(CONFIRM_EMAIL);

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
        return (<div className="m-4">
            <div className="text-center text-dark fw-bold">We sent a confirmation email. Please check your email.</div>
            <div className="d-flex flex-column mt-4 align-items-stretch align-items-sm-center">
                <span className="">Did not receive email? </span>
                <button className="btn btn-primary col-sm-7 mt-3 col-lg-3" onClick={(e) => reset()}>Try again</button>
            </div>
        </div>);
    }

    return (
        <div className="d-flex justify-content-center flex-column">
            <div className="">Please confirm your email address before continuing.</div>
            <form onSubmit={handleSubmit} className="d-flex flex-column align-items-stretch align-items-sm-center mt-4">
                <div className="col col-sm-8 col-md-8">
                    <label htmlFor="signup_email">Email address</label>
                    <input className="form-control col col-sm-8 col-md-5" type="email" name="email" id="signup_email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {error &&
                    <div className="mt-2 col-auto">
                        <span id="passwordHelpInline" className="text-danger form-text fw-bold">
                            {error.message}
                        </span>
                    </div>
                }
                <button disabled={loading} type="submit" className="btn btn-primary mt-4 col col-sm-8 col-md-5">Send confirmation</button>
            </form>

        </div>
    )
}
