const nodemailer = require("nodemailer");
const generateOtp = require("../middlewares/createOtp");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const createUserService = async (userData) => {
  try {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "User already exists." };
    }

    const otp = generateOtp();


    const isSent = await sendOtp(email, otp);
    if (!isSent) {
      return {
        success: false,
        message: "Failed to send OTP. Please try again.",
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      otp: {
        value: otp,
        expiry: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
      },
    });

    return { success: true, data: newUser };
  } catch (err) {
    console.error(err.message);
    return {
      success: false,
      message: "Internal Server Error",
      error: err.message,
    };
  }
};

module.exports = createUserService;

// Send OTP via Email
const sendOtp = async (email, otp) => {
    console.log(email,otp,process.env.EMAIL_PASS)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
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
};

module.exports = { createUserService };
