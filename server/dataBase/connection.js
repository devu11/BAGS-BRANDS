const mongoose = require("mongoose");
require('dotenv').config()
const MONGO_URL = `mongodb+srv://devikaadmin:Devika123*@cluster0.2ahjb8r.mongodb.net/studentsData`

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
