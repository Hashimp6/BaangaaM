const express= require('express')
const { registerAdmin,loginAdmin } = require('../components/adminComponent')
const adminRouter= express.Router()

adminRouter.post('/Register',registerAdmin)
adminRouter.post('/Login',loginAdmin)

module.exports=adminRouter