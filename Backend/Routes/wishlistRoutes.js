const express = require('express')
const wishlistRouter = express.Router()
const {createList, addProductToList, removeProductFromList, getUserWishlist} = require('../Controllers/wishlistController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


wishlistRouter.get('/', isLogin, getUserWishlist)
wishlistRouter.post('/add', isLogin, createList)
wishlistRouter.post('/product/add', isLogin, addProductToList)
wishlistRouter.post('/product/delete', isLogin, removeProductFromList)


module.exports = wishlistRouter