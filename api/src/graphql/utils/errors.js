const ErrorType = {
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    UNAUTHORIZED: 'UNAUTHORIZED',
    VALIDATION: 'VALIDATION',
    MISC: 'MISC'
};

const { GraphQLError } = require('graphql');

class CustomError extends Error {
    constructor(message, code, error = null) {
        super(message);
        this.code = code;
        this.error = error;
    }

    get customMessage() {
        switch (this.code) {
            case ErrorType.UNAUTHENTICATED:
                return 'Not authenticated.';

            case ErrorType.UNAUTHORIZED:
                return 'Not authorized.';
            case ErrorType.VALIDATION:
                return this?.error?.errors?.map(e => e.message)?.join(' ')
            default:
                return this.message;

        }
    }
}

module.exports = { ErrorType, CustomError }