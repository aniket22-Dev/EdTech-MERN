const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Replace with the actual path to your Express app file
const User = require('../models/User');
const OTP = require('../models/OTP');
const dotenv = require("dotenv");
jest.mock('../models/User');
jest.mock('../models/OTP');
const { MONGODB_URL } = process.env;

describe('Signup API', () => {
  let mongoServer;
  let db;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoUri.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoUri.connection;
  });

  afterAll(async () => {
    await mongoServer.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    User.findOne.mockReset();
    OTP.find.mockReset();
  });

  it('should register a new user', async () => {
    User.findOne.mockResolvedValue(null);
    OTP.find.mockReturnValue([
      {
        otp: '123456',
      },
    ]);

    const response = await request(app)
      .post('/signup') // Replace with the actual signup endpoint
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        accountType: 'User',
        contactNumber: '1234567890',
        otp: '123456',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User registered successfully');
    expect(User.create).toHaveBeenCalled();
  });

  // Add more test cases here as needed

});
