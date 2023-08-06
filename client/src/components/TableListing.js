import React from 'react'

export default function TableListing({ name, data, headers, onClick = () => { } }) {
    return (
        <>
            <h1>{name}</h1>
            {
                data.length === 0 && <div>No entries...</div>
            }
            {
                data.length > 0 &&
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {headers.map(e => <th key={e}>{e}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(entry =>
                            <tr key={entry.id}>
                                <button  >Delete</button>
                                {headers.map(e =>
                                    <td key={`${entry.id}-${e}`}>
                                        {entry[e]}
                                    </td>)}
                            </tr>)}
                    </tbody>
                </table>
            }
        </>
    );
}
