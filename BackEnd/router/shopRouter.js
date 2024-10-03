const express= require('express')
const { registerStore, loginStore, updateStore } = require('../components/shopComponent')
const storeRouter= express.Router()

storeRouter.post('/Register',registerStore)
storeRouter.post('/Login',loginStore)
storeRouter.post('/store_datas',updateStore)

module.exports=storeRouter