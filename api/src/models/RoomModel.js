const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Room extends Model {
        //  /**
        //  * Helper method for defining associations.
        //  * This method is not a part of Sequelize lifecycle.
        //  * The `models/index` file will call this method automatically.
        //  */
        static associate(models) {
            models.Room.hasMany(models.Reservation, {
                foreignKey: 'roomId',
                onDelete: 'CASCADE'
            });
        }
    }
    Room.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        roomNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 0, max: 10000, isInt: true }
        },
        roomType: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: { len: [1, 20] }
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 0, max: 10000, isInt: true }
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
        modelName: 'Room'
    })
    return Room;
}