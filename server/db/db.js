const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const DB = process.env.DB;
    if (!DB) {
      throw new Error("Database connection string (DB) is not defined in .env");
    }

    await mongoose.connect(DB);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};

module.exports = connectDB;
