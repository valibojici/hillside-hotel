const { GraphQLError } = require("graphql");

module.exports = async (modelClass, id) => {
    const instance = await modelClass.findByPk(id);
    if (!instance) {
        throw new GraphQLError('Invalid ID.');
    }
    await instance.destroy();
    return instance;
}