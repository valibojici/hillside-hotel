const { GraphQLError } = require("graphql");
const { DateTime } = require('luxon');

const checkInOutValidation = (checkIn, checkOut) => {
    checkIn = parseInt(checkIn);
    checkOut = parseInt(checkOut);

    if (isNaN(checkIn) || isNaN(checkOut)) {
        throw new GraphQLError('Invalid Check In or Check Out date');
    }
    checkIn = DateTime.fromMillis(checkIn).startOf('day');
    checkOut = DateTime.fromMillis(checkOut).startOf('day');

    console.log(checkIn.toISO());
    console.log(checkOut.toISO());

    if (checkIn >= checkOut) {
        throw new GraphQLError('Check In date must be before Check Out date');
    }
    const tommorow = DateTime.now().plus({ days: 1 }).startOf('day')

    if (checkIn < tommorow) {
        throw new GraphQLError('Check In date must be after today');
    }
    return { checkIn, checkOut };
}

module.exports = { checkInOutValidation };