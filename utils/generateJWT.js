const jwt = require('jsonwebtoken');
module.exports = async (payload) => {
    return await jwt.sign(payload, process.env.JWT_Admin_Secret_Key, {expiresIn: '5m'});
};