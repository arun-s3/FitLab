const express = require('express')
const userProductRouter = express.Router()
const upload = require('../Utils/multer')
const {createProduct, getSingleProduct, getAllProducts, searchProduct, updateProduct} = require('../Controllers/productController')

userProductRouter.post('/', upload.array({name:'images', maxCount:10}), getAllProducts)
userProductRouter.get('/search', searchProduct)
userProductRouter.get('/:id', getSingleProduct)

module.exports = userProductRouter