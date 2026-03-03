const express = require('express')
const categoryRouter = express.Router()
const upload = require('../Utils/multer')
const {isLogin, optionalAuth, authorizeAdmin} = require('../Middlewares/Authentication')

const {createCategory, getAllCategories, getFirstLevelCategories, findCategoryById, getCategoryNames, getCategoryIdByName,
         getNestedSubcategoryNames, getDiscountedCategoriesByNames, toggleCategoryStatus, updateCategory, 
         countProductsByCategory, searchCategoryByName} = require('../Controllers/categoryController')


categoryRouter.get('/', optionalAuth, getAllCategories)
categoryRouter.get('/getFirstLevelCategories', optionalAuth, getFirstLevelCategories)
categoryRouter.get('/search', isLogin, authorizeAdmin, searchCategoryByName)
categoryRouter.get('/:id', optionalAuth, findCategoryById)
categoryRouter.post('/add', isLogin, authorizeAdmin, upload.single('image'), createCategory)
categoryRouter.get('/status/:id', isLogin, authorizeAdmin, toggleCategoryStatus)
categoryRouter.get('/getNames/:id', isLogin, authorizeAdmin, getCategoryNames)
categoryRouter.post('/discounts', optionalAuth, getDiscountedCategoriesByNames)
categoryRouter.get('/id/:name', optionalAuth, getCategoryIdByName)
// categoryRouter.get('/everyCategoryNames', getEveryCategoryNames)
categoryRouter.get('/getNestedSubcategoryNames/:id', getNestedSubcategoryNames)
categoryRouter.post('/edit/:id', isLogin, authorizeAdmin, upload.single('image'), updateCategory)
categoryRouter.get('/count/:categoryId', optionalAuth, countProductsByCategory)

module.exports = categoryRouter