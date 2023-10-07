class jSendRes
{
    constructor(data, message, statusCode)
    {
        this.status = "Success";
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }
    getObj()
    {
        const obj = {
            status: this.status,
            data: this.data,
            message: this.message,
            statusCode: this.statusCode
        }
        return obj;
    }
};

module.exports = jSendRes;