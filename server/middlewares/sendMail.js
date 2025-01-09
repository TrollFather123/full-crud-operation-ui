const nodemailer = require("nodemailer");

// Send OTP via Email
const sendOtp = async (email, otp) => {
    console.log(email, otp, process.env.EMAIL_PASS);
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
      await transporter.sendMail(mailOptions);
      // console.log(`OTP sent successfully: ${info.response}`);
      return true;
    } catch (error) {
      console.error(`Error sending OTP: ${error.message}`);
      return false;
    }
  };

module.exports = sendOtp