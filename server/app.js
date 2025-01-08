const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const connectDB = require("./db/db");

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5080;

// Middleware for parsing request body
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Connect to the database
connectDB();

// API routes
app.use("/api/user", userRouter);

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Exporting for testing or modularity
module.exports = app;
