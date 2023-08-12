const { DataTypes, Model } = require("sequelize");
const UserModel = require("./UserModel");
const { GraphQLError } = require('graphql');

module.exports = (sequelize) => {
    class Reservation extends Model {
        //  /**
        //  * Helper method for defining associations.
        //  * This method is not a part of Sequelize lifecycle.
        //  * The `models/index` file will call this method automatically.
        //  */
        static associate(models) {
            models.Reservation.belongsTo(models.User);
            models.Reservation.belongsTo(models.Room);
        }

        static models = null;
    }
    Reservation.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: { tableName: 'Users' }, key: 'id' },
            onDelete: 'cascade',
            validate: {
                userExists: async function (value) {
                    const user = await Reservation.models.User.findByPk(value);
                    if (!user) {
                        throw new GraphQLError('Invalid user ID');
                    }
                }
            }
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: { tableName: 'Rooms' }, key: 'id' },
            onDelete: 'cascade',
            validate: {
                roomExists: async function (value) {
                    const room = await Reservation.models.Room.findByPk(value);
                    if (!room) {
                        throw new GraphQLError('Invalid room ID');
                    }
                }
            }
        },
        checkIn: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
                isCheckinAfterToday(value) {
                    const tommorow = new Date().setHours(24, 0, 0, 0);
                    if (value < tommorow) {
                        throw new GraphQLError('Check In date must be after today');
                    }
                }
            }
        },
        checkOut: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
                isCheckoutAfterCheckin(value) {
                    if (value <= this.checkIn) {
                        throw new GraphQLError('Check In date must be before Check Out date');
                    }
                }
            }
        },
        total: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { isInt: true, min: 0, max: 1_000_000 }
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'canceled'),
            allowNull: false,
        },
        checkoutSessionId: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "test_checkout_id"
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'Reservation'
    })
    return Reservation;
}