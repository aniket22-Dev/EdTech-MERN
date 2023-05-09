const moongose = require("mongoose");

const courseSchema = new moongose.Schema({
  courseName: {
    type: String,
  },
  courseDescription: {
    type: String,
  },
  instructor: {
    type: moongose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  studentsEndrolled: [
    {
      type: moongose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
});

module.exports = moongose.model("Course", courseSchema);
