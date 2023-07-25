const { Sequelize, DataTypes } = require("sequelize");

/*
Steps:
1. Create database connection using ENV variables
2. Get model definers (function that create them)
    2.a. Define models
    2.b. Check if model has associations
3. Export models
*/

models = {}

// 1.
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }
);

// 2
const model_definers = [
    require('./UserModel'),
    require('./RoomModel'),
    require('./ReservationModel'),
];

// 2.a
for (const model_definer of model_definers) {
    // create model
    model = model_definer(sequelize);
    // cache model
    models[model.name] = model;
}

// 2.b
Object.keys(models).forEach(name => {
    // check if this model has associations
    if (models[name].associate) {
        models[name].associate(models);
    }
});

// 3
module.exports = { models, sequelize };
