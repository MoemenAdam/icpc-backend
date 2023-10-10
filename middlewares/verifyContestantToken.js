const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');
const contestantModel = require('../models/contestantModel');
const asyncWrapper = require('../middlewares/asyncWrapper');

module.exports = asyncWrapper( async (req, res, next) => {
    const auth = req.headers['Authorization'] || req.headers['authorization'];
    if(!auth)
        return next(errorHandler.create('No token found', 'Failed', 400));
    const token = auth.split(' ')[1];
    if(!token)
        return next(errorHandler.create('Bad format', 'Failed', 400));
    const decoded = await jwt.verify(token, process.env.JWT_User_Secret_Key);
    const email = decoded.email;
    const contestant = await contestantModel.findOne({email});
    if(!contestant)
        return next(errorHandler.create('Didn\'t find that admin..', 'Failed', 404));
    req.currentContestant = decoded;
    next();
});