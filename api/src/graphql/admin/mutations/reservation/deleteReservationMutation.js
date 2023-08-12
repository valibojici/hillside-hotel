const { GraphQLNonNull, GraphQLError, GraphQLID } = require("graphql");
const { reservationType } = require("../../../types/reservationType");
const deleteHelper = require("../utils/deleteHelper");

module.exports = {
    type: reservationType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, { id }, { jwtPayload, models }) => {
        return (await deleteHelper(models.Reservation, id));
    }
}