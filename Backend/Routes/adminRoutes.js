const express = require('express')
const adminRouter = express.Router()
const upload = require('../Utils/multer')

const {isLogin, isLogout, authorizeAdmin} = require('../Middlewares/Authentication')
const {signinAdmin, signoutAdmin, showUsers, updateRiskyUserStatus, toggleBlockUser, getUserStats} = require('../Controllers/adminController') 
const {updateUserDetails, updateProfilePic, resetPassword} = require('../Controllers/userController')


adminRouter.post('/signin', signinAdmin) 
adminRouter.get('/signout', isLogin, signoutAdmin)
adminRouter.post("/update", isLogin, authorizeAdmin, updateUserDetails)
adminRouter.post("/password/update", isLogin, authorizeAdmin, resetPassword)
adminRouter.put("/profilePic", isLogin, authorizeAdmin, upload.single("image"), updateProfilePic)
adminRouter.post('/customers', isLogin, authorizeAdmin, showUsers) 
adminRouter.get('/toggleblockuser', isLogin, authorizeAdmin, toggleBlockUser) 
adminRouter.put('/risk/:userId', isLogin, authorizeAdmin, updateRiskyUserStatus) 
adminRouter.get('/stats/:userId', isLogin, authorizeAdmin, getUserStats) 




module.exports = adminRouter