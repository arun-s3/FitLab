const express = require('express')
const adminRouter = express.Router()
const {isLogin, isLogout, authorizeAdmin} = require('../Middlewares/Authentication')
const {tester, signinAdmin, signoutAdmin, showUsers, showUsersofStatus, deleteUser, deleteUserList, toggleBlockUser} = require('../Controllers/adminController')
const {createProduct} = require('../Controllers/productController')

adminRouter.get('/test', tester)

adminRouter.post('/signin', isLogout, signinAdmin)
adminRouter.get('/signout', isLogin, signoutAdmin)
adminRouter.get('/customers', showUsers) //, isLogin, authorizeAdmin
adminRouter.get('/customersOfStatus',showUsersofStatus) //, isLogin, authorizeAdmin
adminRouter.get('/deleteuser', deleteUser) //isLogin, authorizeAdmin
adminRouter.post('/deleteuserslist', deleteUserList) //, isLogin, authorizeAdmin
adminRouter.get('/toggleblockuser', toggleBlockUser) //, isLogin, authorizeAdmin

// adminRouter.post('/products', (req, res)=> res.send("Hello"))



module.exports = adminRouter