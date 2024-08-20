const express = require('express')
const adminRouter = express.Router()
const {tester, signinAdmin} = require('../Controllers/adminController')

adminRouter.get('/test', tester)

adminRouter.post('/signin', signinAdmin)




module.exports = adminRouter