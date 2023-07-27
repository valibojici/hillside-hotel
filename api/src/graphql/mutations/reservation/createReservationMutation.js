const { GraphQLList, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLError } = require("graphql");
const { models, sequelize } = require('../../../models');
const { Op } = require("sequelize");
const { reservationType } = require("../../types/reservationType");

module.exports = {
    type: reservationType,
    description: "Try to create a reservation",
    args: {
        checkIn: { type: new GraphQLNonNull(GraphQLString) },
        checkOut: { type: new GraphQLNonNull(GraphQLString) },
        roomTypeId: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(GraphQLInt) },
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

        const tommorow = models.Reservation.getNextDay(new Date()).getTime();

        if (args.checkIn < tommorow) {
            throw new Error('Check In date must be after today');
        }
        const nights = (args.checkOut - args.checkIn) / (24 * 60 * 60 * 1000);

        try {
            const reservation = await sequelize.transaction(async t => {
                // get room ids which are OCCUPIED in this period
                const roomIds = (await models.Reservation.findAll({
                    attributes: ['roomId'],
                    where: {
                        [Op.or]: [
                            { checkIn: { [Op.between]: [args.checkIn, args.checkOut] } },
                            { checkOut: { [Op.between]: [args.checkIn, args.checkOut] } },
                        ]
                    }
                }, { transaction: t })).map(reservation => reservation.roomId);

                // get a random room that is available and of the requested type
                const room = await models.Room.findOne({
                    // of requested type
                    include: {
                        attributes: [],
                        model: models.RoomType,
                        required: true,
                        where: {
                            id: args.roomTypeId
                        }
                    },
                    // available
                    where: { id: { [Op.notIn]: roomIds } }
                }, { transaction: t });

                if (!room) {
                    throw new GraphQLError('No rooms available');
                }

                // create reservation
                const totalPrice = (await room.getRoomType()).price * nights;
                const newReservation = await models.Reservation.create({
                    userId: args.userId,
                    roomId: room.id,
                    checkIn: args.checkIn,
                    checkOut: args.checkOut,
                    total: totalPrice,
                    status: 'pending'
                }, { transaction: t });

                const reservation = await models.Reservation.findByPk(newReservation.id, { transaction: t });
                return reservation;
            });

            return reservation;
        }
        catch (error) {
            throw error;
        }
    }
}