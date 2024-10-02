const express = require('express')
const productRouter = express.Router()
const upload = require('../Utils/multer')
const {createProduct, getSingleProduct, getAllProducts, updateProduct} = require('../Controllers/productController')

productRouter.post('/add', upload.array(10, 'images'), createProduct)


module.exports = productRouter