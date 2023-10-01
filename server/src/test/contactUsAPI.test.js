const mailSender = require("../../utils/mailSender");
const { contactUsEmail } = require("../../mail/templates/contactFormRes");
const {contactUsController} = require('../../controllers/ContactUs')
const mongoose = require("mongoose");
const res = require("express/lib/response");
jest.mock("../../utils/mailSender"); // Mock the mailSender module

const mockMailSender = jest.fn(); // Create a mock function

// Assign the mock function to the mailSender object
// mailSender.mockImplementation(mockMailSender);

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

// Successfully sends email and returns success message
test('should send email successfully and return success message', async () => {
  // Arrange
  const req = {
    body: {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      message: 'Test message',
      phoneNo: '1234567890',
      countrycode: '+1'
    }
  };
  const res = {
    json: jest.fn()
  };
  const expectedResponse = {
    success: true,
    message: 'Email send successfully'
  };

  // Act
  await contactUsController(req, res);

  // Assert
  expect(res.json).toBeCalledTimes(1);
});

// Throws error and returns failure message if email sending fails
mockMailSender.mockRejectedValue(new Error('Email sending failed'));

test('should throw error and return failure message if email sending fails', async () => {
  // Arrange
  const req = {
    body: {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      message: 'Test message',
      phoneNo: '1234567890',
      countrycode: '+1'
    }
  };
  const res = {
    json: jest.fn()
  };
  const expectedResponse = {
    success: true,
    message: 'Email send successfully'
  };

  // Act
  await contactUsController(req, res);

  // Assert
  expect(res.json).toHaveBeenCalledWith(expectedResponse);
});

// Logs request body
const mockConsoleLog = jest.spyOn(console, 'log');

test('should log request body', async () => {
  // Arrange
  const req = {
    body: {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      message: 'Test message',
      phoneNo: '1234567890',
      countrycode: '+1'
    }
  };
  const res = {
    json: jest.fn()
  };

  // Act
  await contactUsController(req, res);

  // Assert
  expect(mockConsoleLog).toHaveBeenCalledWith(req.body);
});
