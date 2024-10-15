const express = require('express')
const userProductRouter = express.Router()
const upload = require('../Utils/multer')
const {createProduct, getSingleProduct, getAllProducts, updateProduct} = require('../Controllers/productController')

userProductRouter.post('/', upload.array({name:'images', maxCount:10}), getAllProducts)

module.exports = userProductRouter