       
const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
      auth: {
      user: "hashimhusain1470@gmail.com",
      pass: process.env.APP_PASS,
    },
  });
   const sendMail=async(to,otp)=> {
   return  info = await transporter.sendMail({
      from: '"BaangaaM 👻" ', 
      to: to, 
      subject: "OTP varification", 
      text: "Your one time password :", 
      html: otp, 
    });
    }
  
module.exports=sendMail