const { DataTypes, Model } = require("sequelize");

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
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: { tableName: 'Rooms' }, key: 'id' },
            onDelete: 'cascade',
        },
        checkIn: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
                isCheckinAfterToday(value) {
                    let tommorow = new Date()
                    tommorow.setHours(24, 0, 0, 0);
                    if (value <= tommorow) {
                        throw new Error('Check In date must be after today.');
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
                        throw new Error('Check In date must be before Check Out date.');
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