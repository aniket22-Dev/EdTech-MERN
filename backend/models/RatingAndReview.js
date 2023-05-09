const moongose = require("mongoose");

const ratingAndReview = new moongose.Schema({
  user: {
    type: moongose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

module.exports = moongose.model("RatingAndReview", ratingAndReview);
