const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;


const contestantSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail , 'Invalid email' ],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    whatsappNumber: {
        type: String,
        required: true,
    },
    cfHandel: {
        type: String,
        required: true,
        unique: true
    },
    messageBox: {
        type: [String],
        default: ["Welcome to ICPC Community"],
        required: true
    },
    activated: {
        type: Boolean,
        default: false,
        required: true
    },
    level: {
        type: String,
        enum: ["Pending", "Level#0", "Level#1", "Level#2", "Retired"],
        default: "Pending",
        required: true
    }
});


module.exports = mongoose.model('contestants', contestantSchema);