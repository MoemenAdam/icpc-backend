const jSendRes = require('../utils/jSendResponse');


const getPage = async (req, res, next) => {
    res.json(new jSendRes(null, 'Can access Page', 200).getObj());
};



module.exports = {
    getPage
}