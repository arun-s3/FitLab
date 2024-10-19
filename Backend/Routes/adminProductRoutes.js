const express = require('express')
const adminProductRouter = express.Router()
const upload = require('../Utils/multer')
const {createProduct, getSingleProduct, getAllProducts, updateProduct, toggleProductStatus} = require('../Controllers/productController')

adminProductRouter.post('/list', getAllProducts)
adminProductRouter.post('/add', upload.fields([{name:'images', maxCount:10}, {name:'thumbnail', maxCount:1}]), createProduct)
adminProductRouter.put('/edit/:id', upload.fields([{name:'images', maxCount:10}, {name:'thumbnail', maxCount:1}]), updateProduct)
adminProductRouter.get('/status/:id', toggleProductStatus)

module.exports = adminProductRouter