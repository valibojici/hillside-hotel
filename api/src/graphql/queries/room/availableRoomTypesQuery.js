/**
 * When user selects checkin and checkout, the available room
 * types will be returned for the user to select which room type 
 * he wants
 */


const { GraphQLList, GraphQLString, GraphQLNonNull, GraphQLError } = require("graphql");
const { Op } = require("sequelize");
const { roomTypeType } = require("../../types/roomTypeType");
const { checkInOutValidation } = require("../../utils/dateValidation");

module.exports = {
    type: new GraphQLList(roomTypeType),
    description: "What room types are available",
    args: {
        checkIn: { type: new GraphQLNonNull(GraphQLString) },
        checkOut: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, { jwtPayload, models }) => {
        if (!jwtPayload?.data?.userId) {
            throw new Error('Unauthenticated');
        }

        ({ checkIn: args.checkIn, checkOut: args.checkOut } = checkInOutValidation(args.checkIn, args.checkOut));

        // get room ids which are OCCUPIED in this period
        const roomIds = (await models.Reservation.findAll({
            attributes: ['roomId'],
            where: {
                status: { [Op.ne]: 'canceled' },
                [Op.or]: [
                    { checkIn: { [Op.between]: [args.checkIn.toMillis(), args.checkOut.toMillis()] } },
                    { checkOut: { [Op.between]: [args.checkIn.toMillis(), args.checkOut.toMillis()] } },
                ],
            }
        })).map(reservation => reservation.roomId);

        if (roomIds.length === 0) {
            throw new GraphQLError('No rooms available');
        }

        // get room types for the available rooms
        const types = await models.RoomType.findAll({
            distinct: true,
            include: {
                attributes: [],
                model: models.Room,
                required: true,
                where: {
                    id: { [Op.notIn]: roomIds }
                }
            }
        });

        return types;
    }
}