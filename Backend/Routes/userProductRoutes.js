const express = require('express')
const userProductRouter = express.Router()
const upload = require('../Utils/multer')
const {createProduct, getSingleProduct, getAllProducts, getLatestProducts, getPopularProducts, getSimilarProducts, 
    searchProduct, updateProduct} = require('../Controllers/productController')

userProductRouter.post('/', upload.array({name:'images', maxCount:10}), getAllProducts)
userProductRouter.get('/latest', getLatestProducts)
userProductRouter.get('/popular', getPopularProducts)
userProductRouter.post('/similar', getSimilarProducts)
userProductRouter.get('/search', searchProduct)
userProductRouter.get('/:id', getSingleProduct)

module.exports = userProductRouter