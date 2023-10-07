const contestantModel = require('../models/contestantModel');
const jSendRes = require('../utils/jSendResponse');
const bcrypt = require('bcryptjs');
const errorHandler = require('../utils/errorHandler');
const genToken = require('../utils/generateJWT');

const getAll = async (req, res, next) => {
    const page = req.qurey.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const contestants = await contestantModel.find().limit(limit).skip(skip);
    res.json(new jSendRes({contestants}, 'Data retrived success', 200).getObj());
};

const addContestant = async (req, res, next) => {
    const contestantData = req.body;
    const isExist = await contestantModel.fineOne({email: contestantData.email});
    if(isExist)
        return next(errorHandler.create('Email already exists', 'Failed', 400));
    const contestant = new contestantModel({
        ...contestantData
    });
    await contestant.save();
    res.status(201).json(new jSendRes({contestant}, 'contestant added success', 201).getObj())
}

const getContestant = async (req, res, next) => {
    const id = req.param.id;
    const contestant = await contestantModel.findOne({_id: id});
    if(!contestant)
        return next(errorHandler.create('No contestant found with that id', 'Failed', 404));
    res.json(new jSendRes({contestant}, 'Found', 200).getObj());
};

const deleteContestant = async (req, res, next) => {
    const id = req.param.id;
    const contestant = await contestantModel.findOneAndDelete({_id: id});
    if(!contestant)
        return next(errorHandler.create('No contestant with that id found', 'Failed', 404));
    res.json(new jSendRes({contestant}, 'Deleted Success', 200).getObj());
};

const updateContestant = async (req, res, next) => {
    const id = req.param.id;
    const obj = req.body;
    const contestant = contestantModel.findOneAndUpdate({_id: id}, {...obj});
    if(!contestant)
        return next(errorHandler.create('No contestant found with that id', 'Failed', 404));
    contestant = {
        ...contestant,
        ...obj
    }
    res.json(new jSendRes({contestant}, 'Updated success', 200).getObj());
};

const signup = async (req, res, next) => {
    const contestantData = req.body;
    const isExist = await contestantModel.fineOne({email: contestantData.email});
    if(isExist)
        return next(errorHandler.create('Email already exists', 'Failed', 400));
    // hasing password
    const hashedPassword = await bcrypt.hash(contestantData.password, 8);
    contestantData.password = hashedPassword;

    // generating new token
    // const token = await genToken({id: contestantData._id, email: contestantData.email});
    const contestant = new contestantModel({
        ...contestantData
    });
    await contestant.save();
    res.status(201).json(new jSendRes({contestant}, 'Signed up success', 201).getObj());
};

const login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email)
        return next(errorHandler.create('Why no email...?', 'Failed', 400));
    if(!password)
        return next(errorHandler.create('Why no password', 'Failed', 400));
    const contestant = await contestantModel.findeOne({email});
    if(!contestant)
        return next(errorHandler.create('Email doesn\'t exist', 'Failed', 404));
    const test = await bcrypt.compare(password, contestant.password);
    if(!test)
        return next(errorHandler.create('Wrong password', 'Failed', 400));
    // generating new token
    const token = await genToken({id: contestant._id, email: contestant.email});
    contestant.token = token;
    await contestant.save();
    res.json(new jSendRes({contestant}, 'Loged in success', 200).getObj());
};

module.exports = {
    getAll,
    addContestant, 
    updateContestant,
    deleteContestant,
    getContestant,
    signup,
    login
}