const { instance } = requre("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
//const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail')

exports.capturePayment = async (req, res) => {
  try {
    const { course_id } = req.body;
    const userId = req.user.id;

    if (!course_id) {
      //404 and please provide course id
    }

    let course;

    try {
      course = await Course.findById(course_id);
   
      if (!course) {
        //return response 404
      }

      const uid = new moongoose.Types.ObjectId(userId);

      if (course.studentsEndrolled.includes(uid)) {
        // return status 200 student is enrollled already and sucess is false
      }
    } catch (err) {
      // return response 500 sucess will be false and message is error
    }

    const amount = course.price;
    const currency = "INR";

    const option = {
      amount: amount * 100,
      currency,
      reciept: Math.random(Date.now().toString()),
      notes: {
        courseId: course_id,
        userId,
      },
    };

    try {
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
      //return response 200 with courseName:course.CourseName, courseDescription:course.CourseDescription, thumbnail: course.CourseThumbnail, orderId: paymentResponse.id,currency: paymentResponse.currency,amount: paymentResponse.amount
    } catch (err) {
      // return response 500 and sucess to false
    }
  } catch (err) {
    console.log("error is", err);
  }
};

exports.verifySignature = async (req, res) => {
  try {
    const webHookSecret = "12345678";
    const signature = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmac("sha256", webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
      console.log("payment authorised");

      const { courseId, userId } = req.body.payload.payment.entity.notes;

      try {
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        );

        if (!enrolledCourse) {
          // return response and course not enrolled
        }

        const enrolledStudent = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { courses: courseId } },
          { new: true }
        );

        //send confirmation mail
        const emailResponse = await mailSender(
          enrolledStudent.email,
          "enrolled Sucessfully",
          "onBoarded to new course"
        );

        //return res 200 with body and sucess true with message
      } catch (err) {
        //return 500 error
      }
    }
  } catch (err) {
    // send 500 error with message and sucess
  }
};
