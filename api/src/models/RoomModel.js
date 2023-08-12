const { DataTypes, Model } = require("sequelize");
const { GraphQLError } = require('graphql');

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

            models.Room.belongsTo(models.RoomType, {
                foreignKey: 'roomTypeId',
                onDelete: 'CASCADE'
            });
        }

        static models = null;
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
            unique: true,
            validate: { min: 0, max: 10000, isInt: true }
        },
        roomTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: { tableName: 'RoomTypes' }, key: 'id' },
            onDelete: 'cascade',
            validate: {
                isInt: true,
                roomTypeExists: async function (value) {
                    const type = await Room.models.RoomType.findByPk(value);
                    if (!type) {
                        throw new GraphQLError('Invalid room type ID');
                    }
                }
            }
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