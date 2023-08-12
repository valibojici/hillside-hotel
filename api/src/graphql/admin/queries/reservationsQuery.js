const { GraphQLList } = require("graphql");
const { reservationType } = require("../../types/reservationType");

module.exports = {
    type: new GraphQLList(reservationType),
    resolve: async (parent, args, { jwtPayload, models }) => {
        return models.Reservation.findAll();
    }
}