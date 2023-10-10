const jwt = require('jsonwebtoken');
const genAdminToken = async (payload) => {
    return await jwt.sign(payload, process.env.JWT_Admin_Secret_Key, {expiresIn: '5m'});
};

const genContestantToken = async(payload) => {
    return await jwt.sign(payload, process.env.JWT_User_Secret_Key, {expiresIn: '5m'});
}

module.exports = {
    genAdminToken,
    genContestantToken
}