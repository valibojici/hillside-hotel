const { GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLError, GraphQLID } = require("graphql");
const { reservationType } = require("../../../types/reservationType");
const { checkInOutValidation } = require("../../../utils/dateValidation");
const { reservationStatusType } = require("../../../types/reservationStatusType");
const { ValidationError } = require("sequelize");
const createHelper = require("../utils/createHelper");

module.exports = {
    type: reservationType,
    args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        roomId: { type: new GraphQLNonNull(GraphQLID) },
        checkIn: { type: new GraphQLNonNull(GraphQLString) },
        checkOut: { type: new GraphQLNonNull(GraphQLString) },
        total: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: new GraphQLNonNull(reservationStatusType) }
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        ({ checkIn: args.checkIn, checkOut: args.checkOut } = checkInOutValidation(args.checkIn, args.checkOut));

        return (await createHelper(models.Reservation, args));
    }
}