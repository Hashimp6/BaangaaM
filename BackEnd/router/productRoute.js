const express= require('express')
const { createProduct, findAllProducts, allProduct, deleteProduct } = require('../components/productComponent')
const { addToCart, allCart, updateCartItem, removeFromCart } = require('../components/cartComponent')
const { addToFavorite, removeFromFavorite } = require('../components/addToFavorite')
const authenticateStore = require('../middleware/storeMidleware')
const authenticateUser = require('../middleware/userMiddleware')

const productRouter=express.Router()

productRouter.post('/addProduct',authenticateStore,createProduct)
productRouter.get('/allProducts/:email',authenticateStore,findAllProducts)
productRouter.get('/all',allProduct)
productRouter.delete('/delete/:productId',deleteProduct)
productRouter.post('/addtocart',authenticateUser,addToCart)
productRouter.get('/allcart/:userId',authenticateUser,allCart)
productRouter.put('/updatecart/:userId/:productId',authenticateUser, updateCartItem);
productRouter.delete('/removefromcart/:userId/:productId',authenticateUser, removeFromCart);
productRouter.post("/add-to-favorite",authenticateUser, addToFavorite);
productRouter.post("/remove-from-favorite",authenticateUser, removeFromFavorite);


module.exports=productRouter