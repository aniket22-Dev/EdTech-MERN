const { createCategory } = require('../../controllers/Category');
const mongoose = require("mongoose");

describe('Category API Test case', () => {
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

  // Successfully create a new category with name and description
  it('should create a new category when name and description are provided', async () => {
    // Mock request and response objects
    const req = {
      body: {
        name: 'Test Category',
        description: 'Test Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the function
    await createCategory(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Category Created Successfully"
    });
  });

  // Return 400 if name is not provided
  it('should return 400 when name is not provided', async () => {
    // Mock request and response objects
    const req = {
      body: {
        description: 'Test Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the function
    await createCategory(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "All fields are required"
    });
  });

  // Test that the function returns a JSON object
  it('should return a JSON object', async () => {
    // Mock request and response objects
    const req = {
      body: {
        name: 'Test Category',
        description: 'Test Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the function
    await createCategory(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toBeInstanceOf(Object);
  });

});
