const { GraphQLError } = require("graphql");
const { ValidationError } = require("sequelize");

module.exports = async (modelClass, args) => {
    try {
        const instance = await modelClass.create(args);
        return await modelClass.findByPk(instance.id);
    } catch (error) {
        throw new GraphQLError(error instanceof ValidationError ? error.errors.map(e => e.message).join(' ') : 'Something went wrong...');
    }
}