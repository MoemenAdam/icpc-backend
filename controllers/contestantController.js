const contestantModel = require('../models/contestantModel');
const jSendRes = require('../utils/jSendResponse');
const {genContestantToken} = require('../utils/generateJWT');
const bcrypt = require('bcryptjs');
const errorHandler = require('../utils/errorHandler');


// get all contestant [admin]
const getAll = async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 100;
    const skip = (page - 1) * limit;
    const contestants = await contestantModel.find().limit(limit).skip(skip);
    res.json(new jSendRes({contestants}, 'Data retrived success', 200).getObj());
};

// add a new contestant [admin]
const addContestant = async (req, res, next) => {
    const contestantData = req.body;
    const isExist = await contestantModel.findOne({email: contestantData.email});
    if(isExist)
        return next(errorHandler.create('Email already exists', 'Failed', 403));
    const contestant = new contestantModel({
        ...contestantData
    });
    await contestant.save();
    res.status(201).json(new jSendRes({contestant}, 'contestant added success', 201).getObj())
}

// get a single contestant [who knows]
const getContestant = async (req, res, next) => {
    const id = req.param.id;
    const contestant = await contestantModel.findOne({_id: id});
    if(!contestant)
        return next(errorHandler.create('No contestant found with that id', 'Failed', 404));
    res.json(new jSendRes({contestant}, 'Found', 200).getObj());
};

// delete a single contestant [admin]
const deleteContestant = async (req, res, next) => {
    const id = req.params.id;
    const contestant = await contestantModel.findOneAndDelete({_id: id});
    if(!contestant)
        return next(errorHandler.create('No contestant with that id found', 'Failed', 404));
    res.json(new jSendRes({contestant}, 'Deleted Success', 200).getObj());
};

// update a signle contestant [admin]
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

// [contestant]
const signup = async (req, res, next) => {
    const contestantData = req.body;
    const isExist = await contestantModel.findOne({email: contestantData.email});
    if(isExist)
        return next(errorHandler.create('Email already exists', 'Failed', 403));
    // hasing password
    const hashedPassword = await bcrypt.hash(contestantData.password, 8);
    contestantData.password = hashedPassword;

    // generating new token
    const token = await genContestantToken({id: contestantData._id, email: contestantData.email});
    contestantData.token = token;
    
    const contestant = new contestantModel({
        ...contestantData
    });
    await contestant.save();
    res.status(201).json(new jSendRes({contestant}, 'Signed up success', 201).getObj());
};
// [contestant]
const login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email)
        return next(errorHandler.create('Why no email...?', 'Failed', 406));
    if(!password)
        return next(errorHandler.create('Why no password', 'Failed', 406));
    const contestant = await contestantModel.findOne({email});
    if(!contestant)
        return next(errorHandler.create('Email doesn\'t exist', 'Failed', 404));
    if(!contestant.activated)
        return next(errorHandler.create('This contestant is pending'));
    const test = await bcrypt.compare(password, contestant.password);
    if(!test)
        return next(errorHandler.create('Wrong password', 'Failed', 403));
    // generating new token
    const token = await genContestantToken({id: contestant._id, email: contestant.email});
    contestant.token = token;
    await contestant.save();
    res.json(new jSendRes({contestant}, 'Loged in success', 200).getObj());
};





// get the pending contestants [admin]  

const getPendings = async(req, res, next) => {
    const limit = req.query.limit || 20;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const pendingContestants = await contestantModel.find({activated: false}, {password : false, __v: false}).limit(limit).skip(skip);
    res.json(new jSendRes({pendings: pendingContestants}, 'Data retrived success', 200).getObj());
};

// get the activated contestants [admin]
const getActivated = async(req, res, next) => {
    const limit = req.query.limit || 20;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const activatedContestants = await contestantModel.find({activated: true}, {password : false, __v: false}).limit(limit).skip(skip);
    res.json(new jSendRes({contestants: activatedContestants}, 'Data retrived success', 200).getObj());
};

// accept the pending contestant [admin] 
const acceptPending = async (req, res, next) => {
    const id = req.params.id;
    const contestant = await contestantModel.findOne({_id: id, activated: false});
    if(!contestant)
        return next(errorHandler.create('Didn\'t find in database', 'Failed', 404));
    contestant.level = "Level#0";
    contestant.activated = true;
    await contestant.save();
    res.json(new jSendRes({contestant}, 'Accepted contestant', 200));
}

// Lower level 
const lower = async(req, res, next) => {
    const id = req.params.id;
    const contestant = await contestantModel.findById(id);
    if(!contestant)
        return next(errorHandler.create('Didn\'t find in database', 'Failed', 404));
    const enums = ["Pending", "Level#0", "Level#1", "Level#2", "Retired"];
    const idx = enums.findIndex((val) => {
        return val == contestant.level;
    });
    if(idx == -1)   
        return next(errorHandler.create('How bad enum', 'Failed', 400));
    if(idx == 0)
        return next(errorHandler.create('Can\'t lower him', 'Failed', 405));
    contestant.level = enums[idx - 1];
    if(idx - 1 == 0)
        contestant.activated = false;
    await contestant.save();
    res.json(new jSendRes(contestant, 'Lowed the contestant', 200));
}

// id :     6525b8a606d00fecb726e10a
// raise level
const raise = async(req, res, next) => {
    const id = req.params.id;
    const contestant = await contestantModel.findById(id);
    if(!contestant)
        return next(errorHandler.create('Didn\'t find in database', 'Failed', 404));
    const enums = ["Pending", "Level#0", "Level#1", "Level#2", "Retired"];
    const idx = enums.findIndex((val) => {
        return val == contestant.level;
    });
    if(idx == -1)   
        return next(errorHandler.create('How bad enum', 'Failed', 400));
    if(idx == 4)
        return next(errorHandler.create('Can\'t raise him', 'Failed', 405));
    contestant.level = enums[idx + 1];
    contestant.activated = true;
    await contestant.save();
    res.json(new jSendRes(contestant, 'Raised the contestant', 200));
}

const getContestantsByLevel = async(req, res, next) => {
    const l = (req.params.level) || -1;
    if(l < 0 || l > 4)
        return next(errorHandler.create(`bad level choosen ${l}`, 'Failed', 400));
    const enums = ["Pending", "Level#0", "Level#1", "Level#2", "Retired"];
    const level = enums[l];
    const limit = req.query.limit || 20;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const contestants = await contestantModel.find({level}, {password: false, __v: false}).limit(limit).skip(skip);
    res.json(new jSendRes({contestants}, 'Data retrived success', 200));
};

module.exports = {
    getAll,
    addContestant, 
    updateContestant,
    deleteContestant,
    getContestant,
    signup,
    login,
    acceptPending,
    getPendings,
    getActivated, 
    lower,
    raise,
    getContestantsByLevel
}