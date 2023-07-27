const { GraphQLList } = require("graphql");
const { reservationType } = require("../../types/reservationType");
const { models } = require('../../../models');

module.exports = {
    type: new GraphQLList(reservationType),
    resolve: async (parent, args, context) => (await models.Reservation.findAll())
}