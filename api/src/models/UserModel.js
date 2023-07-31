const { DataTypes, Model } = require("sequelize");
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {
        //  /**
        //  * Helper method for defining associations.
        //  * This method is not a part of Sequelize lifecycle.
        //  * The `models/index` file will call this method automatically.
        //  */
        static associate(models) {
            models.User.hasMany(models.Reservation, {
                foreignKey: 'userId',
                onDelete: 'CASCADE'
            });
        }

        static async hashPassword(clearText) {
            // TODO check password length (size in bytes) https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(clearText, salt);
            return hash;
        }

        async comparePasswords(clearText) {
            return await bcrypt.compare(clearText, this.password);
        }
    }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: { msg: 'This username is not available.' },
            validate: {
                len: {
                    args: [2, 255],
                    msg: 'Username must be between 2 and 255 characters.'
                }
            }
        },
        password: {
            type: DataTypes.CHAR(60), // bcrypt
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: { msg: 'This email is not available.' },
            validate: {
                isEmail: {
                    msg: 'Invalid email.'
                }
            }
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'User'
    })
    return User;
}