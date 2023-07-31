const { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError } = require("graphql");
const { reservationType } = require("../../../types/reservationType");
const { reservationStatusType } = require("../../../types/reservationStatusType");
const { ValidationError } = require("sequelize");
const updateHelper = require("../utils/updateHelper");

module.exports = {
    type: reservationType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        roomId: { type: GraphQLID },
        checkIn: { type: GraphQLString },
        checkOut: { type: GraphQLString },
        total: { type: GraphQLInt },
        status: { type: reservationStatusType }
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        return (await updateHelper(models.Reservation, args));
    }
}