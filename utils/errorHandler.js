class errorHandler extends Error
{
    constructor()
    {
        super();
    }

    create(message, status, statusCode)
    {
        this.status = status;
        this.message = message;
        this.statusCode = statusCode;
        return this;
    }

};

module.exports = new errorHandler();