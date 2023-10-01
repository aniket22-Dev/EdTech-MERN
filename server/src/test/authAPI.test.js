const bcrypt = require("bcrypt")
const OTP = require("../../models/OTP")
const User = require("../../models/User")
const Profile = require("../../models/Profile")
const { signup } = require('../../controllers/Auth')
const mongoose = require("mongoose");

describe('Auth API Test Cases', () => {
  let req;
  let res;

  const uri = 'mongodb+srv://dbVue:9810189819Ab!@cluster0.idev8jp.mongodb.net/Test-ed-tech'; // Replace with your actual URI

  beforeAll(async () => {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(() => {
    req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        confirmPassword: 'password',
        otp: '123456'
      }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    }

    User.findOne = jest.fn().mockResolvedValue(null)
    OTP.find = jest.fn().mockResolvedValue([{ otp: '123456' }])
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword')
    Profile.create = jest.fn().mockResolvedValue({ _id: 'profileId' })
    User.create = jest.fn().mockResolvedValue({ _id: 'userId' })
  });

  // it('should register a user successfully with all required fields', async () => {
  //   await signup(req, res)
  //
  //   expect(res.status).toHaveBeenCalledWith(200)
  //   expect(res.json).toHaveBeenCalledWith({
  //     success: true,
  //     user: { _id: 'userId' },
  //     message: 'User registered successfully'
  //   })
  // })

  // it('should register a user successfully with optional fields', async () => {
  //   req.body.accountType = 'Student';
  //   req.body.contactNumber = '1234567890';
  //
  //   await signup(req, res)
  //
  //   expect(res.status).toHaveBeenCalledWith(200)
  //   expect(res.json).toHaveBeenCalledWith({
  //     success: true,
  //     user: { _id: 'userId' },
  //     message: 'User registered successfully'
  //   })
  // })
  //
  // it('should register a user successfully with instructor account type', async () => {
  //   req.body.accountType = 'Instructor';
  //   req.body.contactNumber = '1234567890';
  //
  //   await signup(req, res)
  //
  //   expect(res.status).toHaveBeenCalledWith(200)
  //   expect(res.json).toHaveBeenCalledWith({
  //     success: true,
  //     user: { _id: 'userId' },
  //     message: 'User registered successfully'
  //   })
  // })

  it('should return an error when required fields are missing', async () => {
    req.body.email = '';

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: 'All Fields are required'
    })
  })

  it('should return an error when password and confirm password do not match', async () => {
    req.body.password = 'password1';
    req.body.confirmPassword = 'password2';

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Password and Confirm Password do not match. Please try again.'
    })
  })

  it('should return an error when user already exists with the email', async () => {
    User.findOne = jest.fn().mockResolvedValue({ email: 'john.doe@example.com' });

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User already exists. Please sign in to continue.'
    })
  })
})
