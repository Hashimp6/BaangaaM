const express= require('express')
const { registerUser, loginUser } = require('../components/userComponents')
const userRouter= express.Router()

userRouter.post('/Register',registerUser)
userRouter.post('/Login',loginUser)

module.exports=userRouter