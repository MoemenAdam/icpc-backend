module.exports = (ascyncFun, statusCode = 400) => {
    return (req, res, next) => {
        ascyncFun(req, res, next).catch((err) => {
            err.statusCode = statusCode;
            next(err);
        });
    };
};
