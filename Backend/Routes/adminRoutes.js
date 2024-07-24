const express = require('express')
const adminRouter = express.Router()
const {tester} = require('../Controllers/adminController')

adminRouter.get('/test', tester)



module.exports = adminRouter