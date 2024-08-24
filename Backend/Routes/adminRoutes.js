const express = require('express')
const adminRouter = express.Router()
const {tester, signinAdmin, signoutAdmin} = require('../Controllers/adminController')

adminRouter.get('/test', tester)

adminRouter.post('/signin', signinAdmin)
adminRouter.get('/signout', signoutAdmin)




module.exports = adminRouter