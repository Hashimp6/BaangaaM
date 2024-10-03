const express= require('express')
const { registerUser, loginUser, allUsers, deleteUser,  updateAddress } = require('../components/userComponents')
const authenticateJWT = require('../middleware/jwtMiddleware')
const authenticateAdmin = require('../middleware/adminMiddleware')
const userRouter= express.Router()

userRouter.post('/Register',registerUser)
userRouter.post('/Login',loginUser)
userRouter.put('/update-address/:userId', updateAddress)
userRouter.get('/allUsers',  authenticateAdmin,allUsers)
userRouter.delete('/deleteUser/:id',  authenticateAdmin,deleteUser)

module.exports=userRouter