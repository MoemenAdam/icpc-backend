class errorHandler extends Error
{
    constructor()
    {
        super();
    }

    create(message, status, statusCode)
    {
        this.message = message;
        this.status = status;
        this.statusCode = statusCode;
        return this;
    }

};

module.exports = new errorHandler();