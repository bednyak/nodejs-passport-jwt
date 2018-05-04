class DatabaseError extends Error {
    constructor(errors) {
        const message = 'PostgreSQL error';
        super(message);
        this.status = 500;
        this.message = message;
        this.errors = [
            {
                title: errors.message,
                msg: errors.stack
            }
        ];
    }
}

module.exports = DatabaseError;
