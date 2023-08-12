const { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLError } = require("graphql");
const { reservationType } = require("../../../types/reservationType");
const { reservationStatusType } = require("../../../types/reservationStatusType");
const { ValidationError } = require("sequelize");
const updateHelper = require("../utils/updateHelper");

module.exports = {
    type: reservationType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: GraphQLID },
        roomId: { type: GraphQLID },
        checkIn: { type: GraphQLString },
        checkOut: { type: GraphQLString },
        total: { type: GraphQLInt },
        status: { type: reservationStatusType }
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        if (args.checkIn) {
            args.checkIn = new Date((/^\d+$/.test(args.checkIn)) ? parseInt(args.checkIn) : args.checkIn);
        }
        if (args.checkOut) {
            args.checkOut = new Date((/^\d+$/.test(args.checkOut)) ? parseInt(args.checkOut) : args.checkOut);
        }
        console.log(args);
        return (await updateHelper(models.Reservation, args));
    }
}