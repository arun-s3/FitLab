const express = require('express')
const wishlistRouter = express.Router()
const {createList, addProductToList, removeProductFromList, getUserWishlist, getAllWishlistProducts, updateList, deleteList, searchList} 
    = require('../Controllers/wishlistController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


wishlistRouter.get('/', isLogin, getUserWishlist)
wishlistRouter.post('/products', isLogin, getAllWishlistProducts)
wishlistRouter.post('/add', isLogin, createList)
wishlistRouter.post('/product/add', isLogin, addProductToList)
wishlistRouter.post('/product/delete', isLogin, removeProductFromList)
wishlistRouter.put('/list/update', isLogin, updateList)
wishlistRouter.post('/list/delete', isLogin, deleteList)
wishlistRouter.get('/list/search', isLogin, searchList)




module.exports = wishlistRouter