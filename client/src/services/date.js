import { DateTime } from 'luxon';

const fields = ['createdAt', 'updatedAt', 'checkIn', 'checkOut']
function formatTimestamps(obj) {
    return Object.fromEntries(Object.entries(obj).map(([key, val]) => {
        if (fields.includes(key)) {
            val = DateTime.fromMillis(val instanceof Number ? val : parseInt(val)).toUTC().toFormat('dd MMM yyyy T');
        }
        return [key, val];
    }))
}

function toTimestamps(obj) {
    return Object.fromEntries(Object.entries(obj).map(([key, val]) => {
        if (fields.includes(key)) {
            let parsed = DateTime.fromFormat(val, 'dd MMM yyyy T', { zone: 'utc' }).toMillis().toString();
            if (parsed === 'NaN') {
                parsed = DateTime.fromFormat(val, 'dd MMM yyyy', { zone: 'utc' }).toMillis().toString();
            }
            val = parsed;
        }
        return [key, val];
    }))
}

export { formatTimestamps, toTimestamps };