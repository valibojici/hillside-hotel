const { GraphQLError } = require("graphql");

module.exports = class CustomGraphQLError extends GraphQLError {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}


