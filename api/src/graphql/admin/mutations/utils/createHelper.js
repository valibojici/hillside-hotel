
module.exports = async (modelClass, args) => {
    const instance = await modelClass.create(args);
    return await modelClass.findByPk(instance.id);
}