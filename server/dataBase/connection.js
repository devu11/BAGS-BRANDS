const mongoose = require("mongoose");
require('dotenv').config()
const MONGO_URL = `mongodb://127.0.0.1:27017/studentsData`

const connectDB = async () => {
    try {
        const con = await mongoose.connect(MONGO_URL);
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;
