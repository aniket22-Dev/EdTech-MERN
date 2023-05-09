const moongose = require("mongoose");

const courseProgress = new moongose.Schema({
  courseID: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Course",
  },
  completedVideo: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

module.exports = moongose.model("Course", courseProgress);
