const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create course handler function
exports.createCourse = async (req, res) => {
  try {
    //fetch all data
    const { courseName, courseDescrition, whatYouWillLearn, price, tag } =
      req.body;

    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescrition ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const userId = req.user.id;

    const instructorDetails = req.user.findById(userId);
    console.log("instructor Details are", instructorDetails);

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "instructor not found",
      });
    }

    //check given tag is valid or not
    const tagDetails = await Tag.findById(tag);

    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "tagDetails not found",
      });
    }

    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //add new course to the user schema

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course Created",
      data: newCourse,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Unable to create Course",
    });
  }
};

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEndrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      sucess: true,
      message: "All courses fetched Sucessfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
  }
};
