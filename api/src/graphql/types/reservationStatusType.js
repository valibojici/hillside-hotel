const { GraphQLEnumType } = require("graphql");

const reservationStatusType = new GraphQLEnumType({
    name: "ReservationStatus",
    values: {
        'pending': { value: "pending" },
        'completed': { value: "completed" },
        'canceled': { value: "canceled" },
    }
});

module.exports = { reservationStatusType };