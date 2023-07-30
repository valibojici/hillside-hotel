const { GraphQLList, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLError } = require("graphql");
const { models, sequelize } = require('../../../models');
const { Op, Transaction } = require("sequelize");
const { reservationType } = require("../../types/reservationType");
const { DateTime } = require('luxon');

module.exports = {
    type: GraphQLString,
    description: "Try to create a reservation",
    args: {
        checkIn: { type: new GraphQLNonNull(GraphQLString) },
        checkOut: { type: new GraphQLNonNull(GraphQLString) },
        roomTypeId: { type: new GraphQLNonNull(GraphQLInt) },
        successUrl: { type: new GraphQLNonNull(GraphQLString) },
        cancelUrl: { type: new GraphQLNonNull(GraphQLString) },
        // userId: { type: new GraphQLNonNull(GraphQLInt) }, // use JWT instead
    },
    resolve: async (parent, args, { jwtPayload, stripe }) => {
        // check if user is logged in
        if (!jwtPayload || !jwtPayload.data.userId) {
            throw new GraphQLError('Unauthenticated');
        }

        args.checkIn = parseInt(args.checkIn);
        args.checkOut = parseInt(args.checkOut);

        if (isNaN(args.checkIn) || isNaN(args.checkOut)) {
            throw new GraphQLError('Invalid Check In or Check Out date');
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

        const nights = args.checkOut.diff(args.checkIn, 'days').days

        const makeReservation = async () => {
            const reservation = await sequelize.transaction({
                isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, async t => {
                // get room ids which are OCCUPIED in this period
                const roomIds = (await models.Reservation.findAll({
                    attributes: ['roomId'],
                    where: {
                        status: { [Op.ne]: 'canceled' },
                        [Op.or]: [
                            { checkIn: { [Op.between]: [args.checkIn.toMillis(), args.checkOut.toMillis()] } },
                            { checkOut: { [Op.between]: [args.checkIn.toMillis(), args.checkOut.toMillis()] } },
                        ],
                    },
                    transaction: t
                })).map(reservation => reservation.roomId);

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
                    where: { id: { [Op.notIn]: roomIds } },
                    transaction: t
                });

                if (!room) {
                    throw new GraphQLError('No rooms available');
                }

                // create reservation
                const totalPrice = (await room.getRoomType()).price * nights;
                const newReservation = await models.Reservation.create({
                    userId: jwtPayload.data.userId,
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

        let reservation = null;
        // try to make reservation 5 times and check for deadlock
        for (let i = 0; i < 5; ++i) {
            try {
                reservation = await makeReservation();
                break;
            }
            catch (error) {
                // if deadlock try again
                if (error?.parent?.code === 'ER_LOCK_DEADLOCK') {
                    continue;
                }
                // else another error
                throw error;
            }
        }

        if (!reservation) {
            throw new GraphQLError('Something went wrong. Try again later.');
        }

        //make payment
        const room = await reservation.getRoom();
        const roomType = await room.getRoomType();
        const user = await reservation.getUser();
        const data = {
            price_data: {
                currency: 'USD',
                product_data: {
                    name: roomType.name,
                    description: `Check In: ${args.checkIn.toFormat('d LLLL yyyy')} | Check Out: ${args.checkOut.toFormat('d LLLL yyyy')}`
                }
            },
            quantity: 1,
            unit_amount: reservation.total
        }
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: roomType.name
                        },
                        unit_amount: reservation.total
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            client_reference_id: reservation.id,
            customer_email: user.email,
            expires_at: Math.floor(DateTime.now().plus({ minutes: 30 }).toSeconds()),
            success_url: `${args.successUrl}?success=true`,
            cancel_url: `${args.cancelUrl}?canceled=true`,
        });

        return session.url;
    }
}