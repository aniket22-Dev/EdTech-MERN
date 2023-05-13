const User = require("../models/User");
const OTP = require("../models/OTP");
const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config;
//send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already regirstered",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP is", otp);

    const result = await OTP.findOne({ otp: otp });

    while (results) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    } // make use of library redundant code

    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);
    console.log("otp body is", otpBody);

    res.status(200).json({
      sucess: true,
      message: "OTP Generated Sucessfully",
      otp,
    });
  } catch (err) {
    console.log("There is some error in generating OTP");
  }
};

exports.signUp = async (req, res) => {
  try {
    const data = ({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        sucess: false,
        message: "All Fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(403).json({
        sucess: false,
        message: "PassWord and Confirm PassWord doesnot match",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({
        sucess: false,
        message: "User is already registered",
      });
    }

    const resentOtp = await OTP.find({ emai }).sort({ createdAt: -1 }).limit(1);
    console.log(resentOtp);

    if (resentOtp.length == 0) {
      return res.status(400).json({
        sucess: false,
        message: "OTP not found",
      });
    } else if (otp !== resentOtp.otp) {
      return res.status(400).json({
        sucess: false,
        message: "OTP not matching",
      });
    }

    const hashedPassword = await bcyrpt.hash(password, 10);

    const profileDetails = await Profie.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      sucess: true,
      message: "User is registered sucessfully",
    });
  } catch (err) {
    console.log("OOPS!,cant able to signup");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        sucess: false,
        message: "All Fields are Required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        sucess: false,
        message: "User is not registered",
      });
    }

    if (await bcyrpt.compare(passowrd, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };
      res.cokkie("token", token, options).status(200).json({
        sucess: true,
        token,
        user,
        message: "Logged in sucessfully",
      });
    } else {
      return res.status(401).json({
        sucess: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log("Something Went Wrong");
  }
};

// TODO:
exports.changePassword = async (req, body) => {
  try {
    // get data from req body
    // get oldPassword, new Passord , confirmPassorwd
    //validation
    //update pwd in DB
    // send mail-password Updated
    // return resposne
  } catch (err) {}
};
