const express = require('express')
const adminCategoryRouter = express.Router()
const upload = require('../Utils/multer')
const {createCategory} = require('../Controllers/categoryController')

adminCategoryRouter.post('/add', upload.single('image'), createCategory)

module.exports = adminCategoryRouter