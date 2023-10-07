module.exports = (ascyncFun) => {
    return (req, res, next) => {
        ascyncFun(req, res, next).catch((err) => {
            next(err);
        });
    };
};