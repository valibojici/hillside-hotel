export default function RoomType({ type, index = 0 }) {
    console.log(type);
    const imageUrl = new URL(type.image, process.env.REACT_APP_API_BASE_URL);

    return (
        <div className="my-4 d-flex flex-column flex-md-row">
            <div className={`col col-md-5 d-flex justify-content-center flex-column ${index % 2 === 1 ? 'order-md-last' : ''}`}>
                <img className='object-fit-contain w-100' src={imageUrl} alt="img" />
            </div>
            <div className="col col-md-7 d-flex flex-column align-items-center justify-content-center my-2">
                <h3>{type.name}</h3>
                <div className="fw-bold">{type.price / 100}$ per night</div>
                <p className="p-1 p-md-3">{type.description}</p>
            </div>

        </div>
    )
}
