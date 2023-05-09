const moongose = require("mongoose");

const tagsSchema = new moongose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

module.exports = moongose.model("Tags", tagsSchema);
