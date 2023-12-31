import React from 'react'

export default function SelectRoomType({ setRoomType, type, selected = false }) {
    return (
        <div className='col-10 col-sm-5 col-md-4 col-lg-3 p-0 m-0'>
            <div onClick={(e) => setRoomType(type.id)} className={`border ${selected ? 'border-success border-5 bg-success' : 'bg-light'} d-flex flex-column text-center shadow`}>
                <div className='' style={{ height: '20vh' }}>
                    <img className='object-fit-cover w-100 h-100' src={`${new URL(type.image, process.env.REACT_APP_API_BASE_URL)}`} alt="img" />
                </div>
                <div className='p-1'>
                    <div className='fw-bold'>
                        {type.name}
                    </div>
                    <div>
                        <span>{type.price / 100}</span>
                        <span className='small'>$ per night</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
