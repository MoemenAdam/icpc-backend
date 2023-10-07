const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');
module.exports = (req, res, next) => {
    try{
        const auth = req.headers['Authorization'] || req.headers['authorization'];
        if(!auth)
            return next(errorHandler.create('No token found', 'Failed', 400));
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_Admin_Secret_Key);
        console.log(decoded);
        req.currentAdmin = decoded;
        next();
    }
    catch(err)
    {
        return next(err);
    }
}