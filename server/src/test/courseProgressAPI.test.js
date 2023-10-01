// Import necessary modules
const { updateCourseProgress } = require('../../controllers/courseProgress');
const SubSection = require('../../models/Subsection');
const CourseProgress = require('../../models/CourseProgress');
const mongoose = require("mongoose");

describe('Course Progress API Test Cases', () => {
  let req, res;

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
        courseId: 'course123',
        subsectionId: 'subsection123'
      },
      user: {
        id: 'user123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return an error if the subsection is already completed', async () => {
    // Mock the SubSection and CourseProgress functions
    SubSection.findById = jest.fn().mockResolvedValue({ _id: 'subsection123' });
    CourseProgress.findOne = jest.fn().mockResolvedValue({ completedVideos: ['subsection123'] });

    // Call the function
    await updateCourseProgress(req, res);

    // Assertions
    expect(SubSection.findById).toHaveBeenCalledWith('subsection123');
    expect(CourseProgress.findOne).toHaveBeenCalledWith({ courseID: 'course123', userId: 'user123' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Subsection already completed' });
  });
});
