const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');
const adminModel = require('../models/adminModel');
const asyncWrapper = require('../middlewares/asyncWrapper');

module.exports = asyncWrapper( async (req, res, next) => {
    const token = req.cookies.token;
    if(!token)
        return next(errorHandler.create('No token found', 'Failed', 400));
    const decoded = jwt.verify(token, process.env.JWT_Admin_Secret_Key);
    req.currentAdmin = decoded;
    const email = decoded.email;
    const admin = await adminModel.findOne({email});
    if(!admin)
        return next(errorHandler.create('Didn\'t find that admin..', 'Failed', 404));
    next();
});