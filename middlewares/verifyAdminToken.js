const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');
const adminModel = require('../models/adminModel');
const asyncWrapper = require('../middlewares/asyncWrapper');

module.exports = asyncWrapper(async (req, res, next) => {
        const auth = req.headers['Authorization'] || req.headers['authorization'];
        if(!auth)
            return next(errorHandler.create('No token found, Unauthorized', 'Failed', 401));
        const token = auth.split(' ')[1];
        if(!token)
            return next(errorHandler.create('Bad format, Unauthorized', 'Failed', 401));
        const decoded = await jwt.verify(token, process.env.JWT_Admin_Secret_Key);
        const email = decoded.email;
        const admin = await adminModel.findOne({email});
        if(!admin)
            return next(errorHandler.create('Didn\'t find that admin.., Unauthorized', 'Failed', 401));
        req.currentAdmin = decoded;
        next();
}, 401);