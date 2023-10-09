

const getCookie = async (req, res, next) => {
    res.cookie('test', true, {
        maxAge: 1000 * 60 * 60 * 24,
    });
    res.json({
        status: "test",
    })
};

module.exports = {
    getCookie
}