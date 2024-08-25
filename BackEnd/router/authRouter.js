const express = require("express");
const {
  googleAuth,
  googleCallback,
  redirectAfterLogin,
  otpSend,
  otpVarification,
  resendOtp,
} = require("../components/authComponent");
const authRouter = express.Router();

authRouter.get("/google", googleAuth);
authRouter.post("/varify", otpSend);
authRouter.post("/resendOtp", resendOtp);
authRouter.post("/otpvarify", otpVarification);
authRouter.get("/google/callback", googleCallback, redirectAfterLogin);

module.exports = authRouter;
