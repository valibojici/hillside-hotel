export default function User({ user }) {
    return (
        <div>
            <div>Username: {user.username}</div>
            <div>Email: {user.email}</div>
        </div>
    )
}
