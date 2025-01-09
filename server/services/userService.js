const sendOtp = require("../middlewares/sendMail");
const generateOtp = require("../middlewares/createOtp");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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

const resendOtp = async (userId) => {
  try {
    const isUserExists = await User.findOne({ _id: userId });

    if (!isUserExists) {
      return {
        success: false,
        message: "User does not exist",
      };
    }
    const otp = generateOtp();

    const isSent = await sendOtp(isUserExists.email, otp);
    if (!isSent) {
      return {
        success: false,
        message: "Failed to send OTP. Please try again.",
      };
    }

    const updateOtpUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          otp: {
            value: otp,
            expiry: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
          },
        },
      },
      { new: true }
    );

    return { success: true, data: updateOtpUser };
  } catch (err) {
    console.error(err.message);
    return {
      success: false,
      message: "Internal Server Error",
      error: err.message,
    };
  }
};

const verifyUser = async (verifyData) => {
  const { id, otp } = verifyData;
  try {
    const isUserExists = await User.findOne({ _id: id });

    if (!isUserExists) {
      return {
        success: false,
        message: "User does not exist",
      };
    }

    if (isUserExists.otp.value !== otp) {
      return {
        success: false,
        message: "OTP does not match",
      };
    }

    const verifiedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isVerified: true,
        },
      },
      { new: true }
    );

    return { success: true, data: verifiedUser };
  } catch (err) {
    console.error(err.message);
    return {
      success: false,
      message: "Internal Server Error",
      error: err.message,
    };
  }
};

const loginUserService = async (userData) => {
  const { email, password } = userData;
  try {
    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
      return {
        success: false,
        message: "User does not exist",
      };
    }

    if (!isUserExists.isVerified) {
      return {
        success: false,
        message: "User not verified. Please verify your email before login",
      };
    }

    const isMatchPassword = await bcrypt.compare(
      password,
      isUserExists?.password
    );

    if (!isMatchPassword) {
      return {
        success: false,
        message: "Credentials does not match",
      };
    }

    const token = await jwt.sign(
      { id: isUserExists._id },
      process.env.MY_SECRET_CODE,
      {
        expiresIn: "1d",
      }
    );


    return { success: true, data: isUserExists, token };
  } catch (err) {
    console.error(err.message);
    return {
      success: false,
      message: "Internal Server Error",
      error: err.message,
    };
  }
};

module.exports = { createUserService, resendOtp, verifyUser, loginUserService };
