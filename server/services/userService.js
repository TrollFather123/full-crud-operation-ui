const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const generateOtp = require("../middlewares/createOtp");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const otp = generateOtp();

    const isSent = await sendOtp(email, otp);
    if (!isSent) {
      return res
        .status(500)
        .json({ message: "Failed to send OTP. Please try again." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    const newUser = await User.create({
      name,
      email,
      password: hashPassword, // Consider hashing the password before saving
      otp: {
        value: otp,
        expiry: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
      },
    });

    // Respond to the client
    res.status(201).json({
      status: 201,
      data: newUser,
      message: "User created successfully. OTP sent to email.",
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// Send OTP via Email
async function sendOtp(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Use environment variables
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Verification",
    text: `Your OTP is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully: ${info.response}`);
    return true;
  } catch (error) {
    console.error(`Error sending OTP: ${error.message}`);
    return false;
  }
}

module.exports = { createUser };
