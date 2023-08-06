export default function RoomType({ type }) {
    return (
        <div>
            <h3>{type.name}</h3>
            <div>{type.description}</div>
            <div>{type.price / 100}$ per night</div>
        </div>
    )
}
