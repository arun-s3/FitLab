const express = require('express')
const adminRouter = express.Router()
const {isLogin, isLogout, authorizeAdmin} = require('../Middlewares/Authentication')
const {tester, signinAdmin, signoutAdmin, showUsers, deleteUser, deleteUserList, toggleBlockUser} = require('../Controllers/adminController')
const {createProduct} = require('../Controllers/productController')

adminRouter.get('/test', tester)

adminRouter.post('/signin', isLogout, signinAdmin)
adminRouter.get('/signout', isLogin, signoutAdmin)
adminRouter.get('/customers', isLogin, authorizeAdmin, showUsers)
adminRouter.get('/deleteuser', isLogin, authorizeAdmin, deleteUser)
adminRouter.post('/deleteuserslist', isLogin, authorizeAdmin, deleteUserList)
adminRouter.get('/toggleblockuser', isLogin, authorizeAdmin, toggleBlockUser)

adminRouter.post('/products', (req, res)=> res.send("Hello"))



module.exports = adminRouter