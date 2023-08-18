const { ValidationError } = require("sequelize");
const { GraphQLError } = require('graphql');
const { DateTime } = require("luxon");

function formatError(error) {
    error = error?.originalError || error;
    // __log.write(DateTime.now().toISO() + ':' + error.message + '\n');

    if (error instanceof GraphQLError) {
        return { message: error.message };
    }
    if (error instanceof ValidationError) {
        return { message: error.errors.map(e => e.message).join('.') };
    }
    console.log(error);
    return ({ message: `Something went wrong...(${e.message})` });
}

module.exports = { formatError: formatError };