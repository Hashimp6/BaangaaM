const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const userRouter = require("./router/userrouter");
const authRouter = require("./router/authRouter");
const storeRouter = require("./router/shopRouter");
const cloudinary=require('./config/cloudinary')
require("./config/passportConfig");

const PORT = process.env.PORT || 3200;
const app = express();

app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/", userRouter);
app.use("/auth", authRouter);
app.use('/store',storeRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
