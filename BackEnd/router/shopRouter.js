const express= require('express')
const { registerStore, loginStore, updateStore, nearestStore, findAllStores, deleteStores } = require('../components/shopComponent')
const { addShopToFavorite, removeShopFromFavorite } = require('../components/addToFavorite')
const authenticateStore = require('../middleware/storeMidleware')
const authenticateUser = require('../middleware/userMiddleware')
const authenticateAdmin = require('../middleware/adminMiddleware')
const storeRouter= express.Router()

storeRouter.post('/Register',registerStore)
storeRouter.post('/Login',loginStore)
storeRouter.post('/store_datas',authenticateStore,updateStore)
storeRouter.post('/near_stores',authenticateUser,nearestStore)
storeRouter.get('/all_stores',authenticateAdmin,findAllStores)
storeRouter.delete('/:id',authenticateAdmin, deleteStores)
storeRouter.post('/add-to-favorite',authenticateUser,addShopToFavorite)
storeRouter.post('/remove-from-favorite',authenticateUser,removeShopFromFavorite)

module.exports=storeRouter