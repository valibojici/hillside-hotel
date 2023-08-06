import React from 'react'

export default function SelectRoomType({ setRoomType, type }) {
    return <div >
        <label htmlFor={type.name}>{type.name}</label>
        <input type='radio' name='roomType' value={type.id} onClick={(e) => setRoomType(type.id)} />
    </div>
}
