import { Link } from "react-router-dom";


export default function Home() {
    return (
        <div className="navbar-spacer" >
            <div className="title-container text-center vh-100 d-flex flex-column justify-content-center">
                <div className="text-light fancy-text flex-3 my-4" id="hotel-name">Hillside Hotel</div>
                <div className="text-center d-flex justify-content-center flex-3">
                    <Link className="btn btn-danger col col-sm-3 col-xl-2 px-2 py-2 px-md-5 py-md-4 text-light fw-bolder border-start border-bottom" to='/reservation'>Book now</Link>
                </div>
            </div>


            <div className="d-flex justify-content-center">
                <div className="col col-sm-9 col-md-7 my-9 bg-secondary bg-opacity-25 blur" id='home-container'>
                    <div id='description' className="p-3">
                        <div>
                            <div className="d-flex pt-5 justify-content-center">
                                <div className="h1 text-light text-center fancy-text">The Hotel</div>
                            </div>
                            <p className="fs-5 p-3 text-center text-light">
                                Located on the historic California cable car line and only a short walk to Union Square, the Embarcadero, Chinatown, the Ferry Building, and Fisherman’s Wharf, the Omni San Francisco is at the center of the city and provides a true respite for travelers with luxury accommodations and modern comforts.
                            </p>
                        </div>
                        <div>
                            <div className="d-flex pt-5 justify-content-center">
                                <div className="h1 text-light text-center fancy-text">Location</div>
                            </div>
                            <p className="fs-5 p-3 text-light text-center">
                                Situated in the heart of downtown, Hillside Hotel is located near world-class shopping, restaurants, arts districts and the cable car lines that make the city famous. Whether you are visiting for family fun, a staycation, business or romance, make your trip extra special with one of our packages.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
