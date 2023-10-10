const adminModel = require('../models/adminModel');
const contestantModel = require('../models/contestantModel');
const jSendRes = require('../utils/jSendResponse');

const getCountData = async (req, res, next) => {
    const countAdmins = await adminModel.count({});
    const countContestants = await contestantModel.count({activated: true});
    const countPendingContestants = await contestantModel.count({activated: false});
    const response = {
        admins: countAdmins,
        Pendings: countPendingContestants,
        contestants: countContestants
    }
    // deleted 
    // contests
    res.json(new jSendRes(response, 'Data retrived success', 200).getObj());
};

module.exports = {
    getCountData
}