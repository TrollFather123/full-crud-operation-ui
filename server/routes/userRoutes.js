const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Route to register a user
router.post("/register-user", userController.registerUser);

module.exports = router;
