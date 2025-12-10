const express = require('express')
const adminCategoryRouter = express.Router()
const upload = require('../Utils/multer')
const {createCategory, getAllCategories, getFirstLevelCategories, findCategoryById, getCategoryNames, getCategoryIdByName,
         getNestedSubcategoryNames, toggleCategoryStatus, updateCategory, countProductsByCategory} = require('../Controllers/categoryController')

adminCategoryRouter.get('/', getAllCategories)
adminCategoryRouter.get('/getFirstLevelCategories', getFirstLevelCategories)
adminCategoryRouter.get('/:id', findCategoryById)
adminCategoryRouter.post('/add', upload.single('image'), createCategory)
adminCategoryRouter.get('/status/:id', toggleCategoryStatus)
adminCategoryRouter.get('/getNames/:id', getCategoryNames)
adminCategoryRouter.get('/id/:name', getCategoryIdByName)
// adminCategoryRouter.get('/everyCategoryNames', getEveryCategoryNames)
adminCategoryRouter.get('/getNestedSubcategoryNames/:id', getNestedSubcategoryNames)
adminCategoryRouter.post('/edit/:id', upload.single('image'), updateCategory)
adminCategoryRouter.get('/count/:categoryId', countProductsByCategory)

module.exports = adminCategoryRouter