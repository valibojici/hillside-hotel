/**
 * When user selects checkin and checkout, the available room
 * types will be returned for the user to select which room type 
 * he wants
 */


const { GraphQLList, GraphQLString, GraphQLNonNull } = require("graphql");
const { models } = require('../../../models');
const { Op } = require("sequelize");
const { roomTypeType } = require("../../types/roomTypeType");

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
        args.checkIn = new Date(args.checkIn).setHours(0, 0, 0, 0);
        args.checkOut = new Date(args.checkOut).setHours(0, 0, 0, 0);
        if (args.checkIn >= args.checkOut) {
            throw Error('Check In date must be before Check Out date');
        }
        if (args.checkIn < new Date().setHours(24, 0, 0, 0)) {
            throw Error('Check In date must be after today');
        }

        // get room ids which are OCCUPIED in this period
        const roomIds = (await models.Reservation.findAll({
            attributes: ['roomId'],
            where: {
                [Op.or]: [
                    { checkIn: { [Op.between]: [args.checkIn, args.checkOut] } },
                    { checkOut: { [Op.between]: [args.checkIn, args.checkOut] } },
                ]
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