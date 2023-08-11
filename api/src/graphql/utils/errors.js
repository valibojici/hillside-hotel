const { ValidationError } = require("sequelize");
const { GraphQLError } = require('graphql');

function formatError(error) {
    error = error?.originalError || error;

    if (error instanceof GraphQLError) {
        return { message: error.message };
    }
    if (error instanceof ValidationError) {
        return { message: error.errors.map(e => e.message).join('.') };
    }
    console.log(error);
    return ({ message: "Something went wrong..." });
}

module.exports = { formatError: formatError };