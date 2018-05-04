class ServerError extends Error {
    constructor(message, status, type, loc, param, errors) {
        super(message);
        const defaultError = [
            {
                location: loc,
                param: param,
                msg: message
            }
        ];
        this.status = status;
        this.message = type;
        this.errors = errors ? errors : defaultError;
    }
}

module.exports = ServerError;
