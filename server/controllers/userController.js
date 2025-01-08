const userService = require("../services/userService");

const registerUser = async (req, res) => {
  try {


    const {
      success,
      message,
      data: newUser,
    } = await userService.createUserService(req.body);

    if (!success) {
      return res.status(400).json({
        status: 400,
        message,
      });
    }

    return res.status(201).json({
      status: 201,
      data: newUser,
      message: "User created successfully. OTP sent to email.",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


module.exports = {registerUser}