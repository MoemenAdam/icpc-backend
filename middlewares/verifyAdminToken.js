const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');
const adminModel = require('../models/adminModel');
const asyncWrapper = require('../middlewares/asyncWrapper');

module.exports = asyncWrapper( async (req, res, next) => {
    const auth = req.headers['Authorization'] || req.headers['authorization'];
    if(!auth)
        return next(errorHandler.create('No token found', 'Failed', 400));
    const token = auth.split(' ')[1];
    if(!token)
        return next(errorHandler.create('Bad format', 'Failed', 400));
    const decoded = await jwt.verify(token, process.env.JWT_Admin_Secret_Key);
    req.currentAdmin = decoded;
    const email = decoded.email;
    console.log(email);
    const admin = await adminModel.findOne({email});
    console.log('success');
    if(!admin)
        return next(errorHandler.create('Didn\'t find that admin..', 'Failed', 404));
    next();
});