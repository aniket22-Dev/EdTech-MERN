const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

//create Rating
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rating, review, courseId } = req.body;
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEndrolled: { $elemMatch: { $er: userId } },
    });

    if (!courseDetails) {
      // return 404 status code and message with sucess false
    }

    const alreadyReviewd = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewd) {
      //return response code 403 with sucess false and a message already reviewd
    }

    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview,
        },
      },
      { new: true }
    );

    //return res.status 200 with sucess true and a message
  } catch (err) {
    // return response 500 with message and sucess false
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    //if no review exist
    return res.status(200).json({
      success: true,
      averageRating: 0,
    });
  } catch (err) {
    //return response 500 with message and sucess false
  }
};

// getAll Rating
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    //return 200 status with data:allReviews and success true
  } catch (err) {
    //return 500 status code with message unable to fetch
  }
};
