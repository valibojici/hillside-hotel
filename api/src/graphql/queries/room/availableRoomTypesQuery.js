/**
 * When user selects checkin and checkout, the available room
 * types will be returned for the user to select which room type 
 * he wants
 */


const { GraphQLList, GraphQLString, GraphQLNonNull, GraphQLError } = require("graphql");
const { models } = require('../../../models');
const { Op } = require("sequelize");
const { roomTypeType } = require("../../types/roomTypeType");
const { DateTime } = require('luxon');

module.exports = {
    type: new GraphQLList(roomTypeType),
    description: "What room types are available",
    args: {
        checkIn: { type: new GraphQLNonNull(GraphQLString) },
        checkOut: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
        args.checkIn = parseInt(args.checkIn);
        args.checkOut = parseInt(args.checkOut);

        if (isNaN(args.checkIn) || isNaN(args.checkOut)) {
            throw Error('Invalid Check In or Check Out date');
        }
        args.checkIn = DateTime.fromMillis(args.checkIn).startOf('day');
        args.checkOut = DateTime.fromMillis(args.checkOut).startOf('day');

        if (args.checkIn >= args.checkOut) {
            throw new GraphQLError('Check In date must be before Check Out date');
        }
        const tommorow = DateTime.now().plus({ days: 1 }).startOf('day')

        if (args.checkIn < tommorow) {
            throw new GraphQLError('Check In date must be after today');
        }

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

        console.log(roomIds);

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
        // const rooms = await models.Room.findAll({
        //     attributes: [],
        //     distinct: true,
        //     include: {
        //         model: models.RoomType,
        //         as: 'RoomType',
        //         required: true,
        //     },
        //     where: {
        //         id: {
        //             [Op.notIn]: roomIds
        //         }
        //     }
        // });
        console.log(types);

        return types;
    }
}