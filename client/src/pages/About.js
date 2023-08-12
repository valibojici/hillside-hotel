import React from 'react'

export default function About() {
    return (
        <div className='navbar-spacer'>
            <div className="container mt-5 px-0 d-flex justify-content-center">
                <div className="text-dark bg-light bg-opacity-50 blur mx-0 p-2 p-md-4 col col-md-10">
                    <div style={{ fontFamily: 'Great Vibes' }} className="display-3 m-3">About us</div>
                    <div className="container">
                        <p>Welcome to Hillside Hotel, a boutique hotel nestled in San Francisco&#39;s Union Square shopping district. Our ideal location provides guests with access to popular San Francisco sights and attractions such as Dragon’s Gate, Cable Cars, and numerous Union Square shopping and dining options.</p>
                        <p>Whether you are traveling for business or leisure, our boutique communal hotel provides comfort for travelers looking for a unique hotel experience in San Francisco. Our hotel offers 5 unique room types to accommodate your lodging needs: The Single, Queen, Double Queen, King and Deluxe King Room. Each guestroom is ADA Defined service-animal friendly. Hillside Hotel&#39;s non-smoking guest rooms share communal bathrooms and offer travelers a great economical lodging alternative in The Heart of SF. Room amenities include complimentary Wi-Fi, 32-inch flat-screen LCD TV with HD cable channels, and a work desk.</p>
                    </div>
                </div>
            </div>

            <div className="container mt-5 px-0 d-flex justify-content-center">
                <div className=" bg-light bg-opacity-50 blur mx-0 p-2 p-md-4 col col-md-10">
                    <div style={{ fontFamily: 'Great Vibes' }} className="display-3 m-3">Contact</div>


                    <div className="d-flex justify-content-between flex-column flex-lg-row">
                        <div className="p-4 col-12 col-lg-6 d-flex text-dark flex-column justify-content-center">
                            <div className="">
                                <h2>Adress</h2>
                                <hr />
                                <p>23 53rd Street, San Francisco, CA 42122</p>
                            </div>
                            <div className="">
                                <h2>Telephone</h2>
                                <hr />
                                <p>555-2231-322</p>
                            </div>
                            <div className="">
                                <h2>Email</h2>
                                <hr />
                                <p>totally.real.email@domain.com</p>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <iframe className="w-100" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1069.3738154940497!2d-73.81531015477081!3d40.703795509692824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c260c63f41a739%3A0x7fcea07260950cd0!2sHillside%20Hotel!5e0!3m2!1sen!2sro!4v1616171929377!5m2!1sen!2sro" width="600" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" id="google-map"></iframe>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
