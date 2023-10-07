const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;


const adminSchema = new Schema({
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
    }
});


module.exports = mongoose.model('admins', adminSchema);