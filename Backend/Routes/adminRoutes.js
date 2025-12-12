const express = require('express')
const adminRouter = express.Router()
const {isLogin, isLogout, authorizeAdmin} = require('../Middlewares/Authentication')
const {tester, signinAdmin, signoutAdmin, showUsers, showUsersofStatus, deleteUser, deleteUserList, 
    toggleBlockUser, getUserStats} = require('../Controllers/adminController')
const {createProduct} = require('../Controllers/productController')

adminRouter.get('/test', tester)

adminRouter.post('/signin', signinAdmin) //isLogout
adminRouter.get('/signout', isLogin, signoutAdmin)
adminRouter.post('/customers', isLogin, authorizeAdmin, showUsers) 
adminRouter.get('/customersOfStatus', isLogin, authorizeAdmin, showUsersofStatus) 
adminRouter.get('/deleteuser',isLogin, authorizeAdmin, deleteUser) 
adminRouter.post('/deleteuserslist',  isLogin, authorizeAdmin, deleteUserList)
adminRouter.get('/toggleblockuser', isLogin, authorizeAdmin, toggleBlockUser) 
adminRouter.get('/stats/:userId', isLogin, authorizeAdmin, getUserStats) 




module.exports = adminRouter