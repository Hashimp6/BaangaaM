const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const http = require("http");
const cookieParser = require('cookie-parser');
const userRouter = require("./router/userrouter");
const authRouter = require("./router/authRouter");
const storeRouter = require("./router/shopRouter");
const productRouter = require("./router/productRoute");
const adminRouter = require("./router/adminRouter");
const setupSocket = require("./utils/socketIO"); 
const chatRouter = require("./router/chatRouter");
const paymentRouter = require('./router/paymentRouter');
const catagoryRouter = require("./router/catagoryRouter");
const { orderRouter } = require("./router/orderRouter");
require("./config/passportConfig");

const PORT = process.env.PORT || 3200;
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
setupSocket(server);

app.use(cors({
  origin: process.env.frond_end,
  credentials: true
}));
app.use(passport.initialize());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use('/store', storeRouter);
app.use('/product', productRouter);
app.use('/admin', adminRouter);
app.use('/chat', chatRouter);
app.use('/catagory', catagoryRouter);
app.use('/payment', paymentRouter);
app.use('/order', orderRouter);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});