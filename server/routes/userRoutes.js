const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Route to register a user
router.post("/register-user", userController.registerUser);
router.post("/resend-otp", userController.updateOtp);
router.post("/verify-user", userController.verifyUser);

module.exports = router;
