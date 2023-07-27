const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class RoomType extends Model {
        //  /**
        //  * Helper method for defining associations.
        //  * This method is not a part of Sequelize lifecycle.
        //  * The `models/index` file will call this method automatically.
        //  */
        static associate(models) {
            models.RoomType.hasMany(models.Room, {
                foreignKey: 'roomTypeId',
                onDelete: 'CASCADE'
            });
        }
    }
    RoomType.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 0, max: 1_000_000_000, isInt: true }
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
        tableName: 'RoomTypes',
        modelName: 'RoomType'
    })
    return RoomType;
}