const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = requre("bcrypt");
exports.resetPasswordToekn = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your email is not registered",
      });
    }

    const token = crypto.randomUUID(); // generate random token

    const updatedDetails = await User.findOneAndUpdate(
      { emai: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    const url = window.location.origin + `/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    return res.status(200).json({
      success: true,
      message: "Email changed successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.restPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password not Matching",
      });
    }

    const userDetails = await user.findOne({ token: token });

    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    if (userDetails.resetPasswordExpires > Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Token is Expired",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log("error is", error);
  }
};
