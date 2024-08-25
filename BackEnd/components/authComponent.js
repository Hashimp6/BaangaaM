const passport = require("passport");
const crypto = require("crypto");
const { generateToken } = require("../utils/generateJwt");
const sendMail = require("../config/nodeMailerConfig");

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = passport.authenticate("google", { session: false });

let otpStorage = {};

const redirectAfterLogin = (req, res) => {
  try {
    const token = generateToken(req.user);
    console.log("User details after successful login:", req.user);
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: req.user,
      token: token,
    });
  } catch (error) {
    console.error("Error for google auth:", error);
    return res.status(500).json({ message: "issue for google auth" });
  }
};

const otpCreation = async (req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log(otp);
    otpStorage[email] = otp;
    
    try {
      const response = await sendMail(email, otp);
      console.log('mail sent response:', response);
      if (response) {
        return res.status(200).json({ success: true, message: "OTP sent successfully" });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Error sending OTP" });
    }
  };
  
  const otpSend = async (req, res) => {
    try {
      await otpCreation(req, res);
    } catch (error) {
      console.error("Error for sending otp:", error);
      return res.status(500).json({ message: "Error for sending otp" });
    }
  };
  
  const resendOtp = async (req, res) => {
    try {
      await otpCreation(req, res);
    } catch (error) {
      console.error("Error for sending otp:", error);
      return res.status(500).json({ message: "Error for sending otp" });
    }
  };
  

const otpVarification = (req, res) => {
  try {
    const { otp, email } = req.body;
    console.log(otp,email);
    const storedOtp = otpStorage[email];
    console.log(storedOtp);
    if (!storedOtp) {
        return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }
    if (storedOtp === otp) {
        console.log('varifying is success');
       delete otpStorage[email];
        return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
        console.log('varifying is failed');
        return res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error for varifying otp:", error);
    return res.status(500).json({ message: "Error for varify" });
  }
};

module.exports = {
  googleAuth,
  googleCallback,
  redirectAfterLogin,
  otpSend,
  resendOtp,
  otpVarification
};
