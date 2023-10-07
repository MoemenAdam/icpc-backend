class jSendRes
{
    constructor(data, message, statusCode)
    {
        this.message = message;
        this.status = "Success";
        this.statusCode = statusCode;
        this.data = data;
    }
    getObj()
    {
        const obj = {
            message: this.message,
            status: this.status,
            statusCode: this.statusCode,
            data: this.data
        }
        return obj;
    }
};

module.exports = jSendRes;