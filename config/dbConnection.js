const mongoose = require('mongoose');
const dotenv = require("dotenv").config();

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log(`Connection established with database host: ${connect.connection.host} and name: ${connect.connection.name}`);
    } catch (err) {
        console.log('Erroe Encountered :' + err)
        process.exit();
    }
}


module.exports = dbConnect;