export default function User({ user }) {
    return (
        <div>
            <div className="my-2">
                <h5>Username</h5>
                <span>{user.username}</span>
            </div>
            <div className="my-2">
                <h5>Email</h5>
                <span>{user.email}</span>
            </div>
        </div>
    )
}
