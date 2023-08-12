import { useQuery } from "@apollo/client"
import { GET_USER } from "../queries/query"
import { useContext, useEffect } from "react";
import { LoginContext } from "../App";
import User from "../components/User";
import Reservation from "../components/Reservation";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function Profile() {
    const { user, logout } = useContext(LoginContext);
    const { loading, error, data } = useQuery(GET_USER, {
        variables: {
            id: user.userId
        }
    });

    useEffect(() => {
        if (error?.message === 'Unauthenticated') {
            logout();
        }
    }, [logout, error]);

    if (loading) return <div className="navbar-spacer"> <Loading /> </div>
    if (error) return <div className="navbar-spacer"> <Error message={error.message} /> </div>

    let reservations = data.user.reservations;

    return (
        <div className="navbar-spacer">
            <div className="container mt-5">
                <div className="bg-light blur bg-opacity-50 p-5">
                    <h1 className="mb-3">Profile</h1>
                    <hr />
                    <User user={data.user} />
                    <h3 className="mt-5">Reservations</h3>

                    {
                        reservations.length > 0 ?
                            <ul>
                                {[...reservations]
                                    .sort((a, b) => {
                                        if (a.createdAt > b.createdAt) return -1;
                                        if (a.createdAt < b.createdAt) return 1;
                                        return 0;
                                    })
                                    .map(r => <Reservation key={r.id} reservation={r} />)}
                            </ul>
                            : <p>No reservations....</p>
                    }
                </div>
            </div>
        </div>
    )
}
