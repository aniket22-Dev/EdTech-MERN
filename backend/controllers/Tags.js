const Tag = require("../models/tags");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "",
      });
    }

    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });

    return res.status(200).json({
      success: true,
      message: "",
    });
  } catch (err) {}
};

exports.showAlltags = async (req, res) => {
  try {
    const allTags = await Tag.find({ name: true, description: true });

    return res.status(200).json({
      success: true,
      message: "",
    });
  } catch (err) {}
};
