const express = require('express')
const wishlistRouter = express.Router()
const upload = require('../Utils/multer')
const {createList, addProductToList, removeProductFromList, getUserWishlist, getAllWishlistProducts, updateList, deleteList, searchList} 
    = require('../Controllers/wishlistController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


wishlistRouter.get('/', isLogin, getUserWishlist)
wishlistRouter.post('/products', isLogin, getAllWishlistProducts)
wishlistRouter.post('/add', upload.single('image'), isLogin, createList)
wishlistRouter.post('/product/add', isLogin, addProductToList)
wishlistRouter.post('/product/delete', isLogin, removeProductFromList)
wishlistRouter.put('/list/update', upload.single('image'), isLogin, updateList)
wishlistRouter.post('/list/delete', isLogin, deleteList)
wishlistRouter.get('/list/search', isLogin, searchList)




module.exports = wishlistRouter