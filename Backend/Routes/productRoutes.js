const express = require('express')
const productRouter = express.Router()
const upload = require('../Utils/multer')

const {createProduct, getSingleProduct, getAllProducts, getLatestProducts, getPopularProducts, getSimilarProducts, getEquipmentByMuscleOrExercise, 
    searchProduct, updateProduct, toggleProductStatus, restockProduct, 
    exportProductsAsCsv, exportProductsAsPdf} = require('../Controllers/productController')

const {isLogin, optionalAuth, authorizeAdmin} = require('../Middlewares/Authentication')


productRouter.post('/', optionalAuth, upload.array({name:'images', maxCount:10}), getAllProducts)
productRouter.get('/latest', optionalAuth, getLatestProducts)
productRouter.get('/popular', optionalAuth, getPopularProducts)
productRouter.get('/exercise', optionalAuth, getEquipmentByMuscleOrExercise)
productRouter.post('/similar', optionalAuth, getSimilarProducts)
productRouter.get('/search', optionalAuth, searchProduct)
productRouter.get('/:id', optionalAuth, getSingleProduct)

productRouter.post('/add', isLogin, authorizeAdmin, upload.fields([{name:'images', maxCount:10}, {name:'thumbnail', maxCount:1}]), createProduct)
productRouter.put('/edit/:id', isLogin, authorizeAdmin, upload.fields([{name:'images', maxCount:10}, {name:'thumbnail', maxCount:1}]), updateProduct)
productRouter.get('/status/:id', isLogin, authorizeAdmin, toggleProductStatus)
productRouter.put('/restock', isLogin, authorizeAdmin, restockProduct)
productRouter.post('/export/csv', isLogin, authorizeAdmin,  exportProductsAsCsv)
productRouter.post('/export/pdf', isLogin, authorizeAdmin,  exportProductsAsPdf)

module.exports = productRouter