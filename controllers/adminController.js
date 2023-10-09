const admin = require('../models/adminModel');
const genJWT = require('../utils/generateJWT');
const bcrypt = require('bcryptjs');
const errorHandler = require('../utils/errorHandler');
const jSendRes = require('../utils/jSendResponse');

const getAll = async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const admins = await admin.find({}).limit(limit).skip(skip);
    return res.json(new jSendRes({admins}, 'Data retrived....', 200));
};

const add = async (req, res, next) => {
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName || '',
        email: req.body.email,
        password: req.body.password
    }
    data.password = await bcrypt.hash(data.password, 8);
    const newAdmin = new admin({
        ...data
    });
    await newAdmin.save();
    return res.status(201).json(new jSendRes({newAdmin}, 'New Admin has been added....', 201));
}


const login = async (req,res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email)
        return next(errorHandler.create('Why not email ...?', 'Failed', 400));
    if(!password)
        return next(errorHandler.create('Why not password ...?', 'Failed', 400));
    const currentAdmin = await admin.findOne({email});
    if(!currentAdmin)
        return next(errorHandler.create('Invalid email', 'Failed', 404));
    const test = await bcrypt.compare(password, currentAdmin.password);
    if(!test)
        return next(errorHandler.create('Wrong password', 'Failed', 400));
    // token 
    const token = await genJWT({id:currentAdmin._id, email});
    res.cookie("jwt_token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    });
    return res.json(new jSendRes({token}, 'Logged in success', 200).getObj());
}

module.exports = {
    getAll,
    add,
    login
}