import React from 'react'

export default function Footer() {
    return (
        <footer className='bg-black text-light blur bg-opacity-75 ms-auto'>
            <div className="w-100 footer-container">
                <div className="container d-flex justify-content-center align-items-center">
                    <h3 className="fancy-text m-2 footer-title">Hillside Hotel</h3>
                    <div className="m-2 d-flex flex-column">
                        <span className="small">totally.real.address@domain.com</span>
                        <span className="small">555-2231-322</span>
                        <span className="small">23 53rd Street, San Francisco, CA 42122</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
