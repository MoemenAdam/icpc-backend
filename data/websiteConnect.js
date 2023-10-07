const mongoose = require('mongoose');
require('dotenv').config()

const connectToDB = async () => {
    try{
        await mongoose.connect(process.env.icpcConection);
        console.log('Connected To Website DB Succes');
    }
    catch(err)
    {
        console.log(err.message);
    }
}

module.exports = connectToDB;