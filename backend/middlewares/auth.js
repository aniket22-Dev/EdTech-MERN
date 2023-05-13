const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");

    //if token is missing

    if (!token) {
      return res.status(401).json({
        sucess: false,
        message: "Token is missing",
      });
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("deode is", decode);
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        sucess: false,
        message: "Toke is invalid",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      sucess: false,
      message: "Something went wrong while validation",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        sucess: false,
        message: "This is a protected route",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "User role cannot be verified",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        sucess: false,
        message: "This is a protected route",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "User role cannot be verified",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        sucess: false,
        message: "This is a protected route",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "User role cannot be verified",
    });
  }
};
