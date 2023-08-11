const { GraphQLError } = require("graphql");
const { ValidationError } = require("sequelize");

module.exports = async (modelClass, args) => {
    const instance = await modelClass.findByPk(args.id);
    if (!instance) {
        throw new GraphQLError('Invalid ID');
    }
    // get only args which are non null
    const nonNullArgs = Object.fromEntries(Object.entries(args).filter(([key, value]) => key != 'id' && value))

    await instance.set(nonNullArgs);
    await instance.save();

    return (await modelClass.findByPk(args.id));
}