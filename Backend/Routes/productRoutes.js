const express = require('express')
const productRouter = express.Router()
const {createProduct} = require('../Controllers/productController')

productRouter.route('/').get()
productRouter.route('/new').get(createProduct)