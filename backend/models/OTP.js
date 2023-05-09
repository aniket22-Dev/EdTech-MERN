const moongose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new moongose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    tpye: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(email, "Verification Email", otp);
    console.log("Email Send", mailResponse);
  } catch {
    console.log(error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = moongose.model("OTP", OTPSchema);
