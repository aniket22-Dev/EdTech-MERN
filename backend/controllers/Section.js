const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    const newSection = await Section.create({ sectionName });

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Sucessfull",
      updatedCourse,
    });
  } catch (err) {
    console.log("error is", error);
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          sectionName,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Sucessfull",
      updatedSection,
    });
  } catch (err) {
    console.log("error is", err);
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Sucessfull",
    });
  } catch (err) {
    console.log("error is", err);
  }
};
