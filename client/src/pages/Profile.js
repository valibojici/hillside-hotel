import { useQuery } from "@apollo/client"
import { GET_USER } from "../queries/query"
import { useContext, useEffect } from "react";
import { LoginContext } from "../App";
import User from "../components/User";
import Reservation from "../components/Reservation";

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


    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}...</div>

    let reservations = data.user.reservations;

    return (
        <pre>
            <User user={data.user} />
            <ul>
                {
                    [...reservations]
                        .sort((a, b) => {
                            if (a.createdAt > b.createdAt) return -1;
                            if (a.createdAt < b.createdAt) return 1;
                            return 0;
                        })
                        .map(r => <Reservation key={r.id} reservation={r} />)
                }
            </ul>
        </pre>
    )
}
