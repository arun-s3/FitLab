const express = require('express')
const wishlistRouter = express.Router()
const {createList, addProductToList} = require('../Controllers/wishlistController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


wishlistRouter.post('/add', isLogin, createList)
wishlistRouter.post('/product/add', isLogin, addProductToList)


module.exports = wishlistRouter