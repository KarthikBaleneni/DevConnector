const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoConnectionURI');

const connectDB = async () => {

    try {
        await mongoose.connect(db);
        console.log('MonGoose Connection completed');
    } catch (err) {
        console.log('Connection failed');
        //exit process with failure
        process.exit(1);
    }

};

module.exports = connectDB;