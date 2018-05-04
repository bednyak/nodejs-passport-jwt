class ValidationError extends Error {
    constructor(errors) {
        const message = 'Fields validation error';
        super(message);
        this.status = 422;
        this.message = message;
        this.errors = errors;
    }
}

module.exports = ValidationError;
