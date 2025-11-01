const express = require('express')
const userRouter = express.Router()
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const upload = require('../Utils/multer')
const {tester, createUser, sendOtp, verifyOtp, loginUser, clearAllCookies, updateForgotPassword, resetPassword, updateUserDetails, googleSignin,
     updateProfilePic, signout, getUserId,searchUsernames, totalUsersCount, generateUniqueGuestUser, verifyAndDeleteGuestUser,
     googleSignout} = require('../Controllers/userController')

userRouter.get('/test', tester)

userRouter.post('/signup', isLogout, createUser)    
userRouter.post('/sendOtp', sendOtp)                                                                                                         //isLogout, 
userRouter.post('/verifyOtp', verifyOtp)                                                                                                     //isLogout,
userRouter.post('/signin', isLogout, loginUser)
userRouter.get('/clear-cookies', clearAllCookies)
userRouter.post('/update', isLogin, updateUserDetails)
userRouter.post('/password/reset', isLogin, updateForgotPassword)
userRouter.post('/password/update', isLogin, resetPassword)
userRouter.put('/profilePic', isLogin, upload.single('image'), updateProfilePic)
userRouter.get('/signout', isLogin, signout)
userRouter.get('/search/:searchTerm', isLogin, searchUsernames)
userRouter.get('/getUserid', isLogin, getUserId) 
userRouter.get('/totalUsers', isLogin, totalUsersCount)
userRouter.get('/guest', generateUniqueGuestUser)
userRouter.get('/guest-check', verifyAndDeleteGuestUser)
userRouter.post('/googleSignin', googleSignin)
userRouter.get('/googlesignout', signout) 

module.exports = userRouter 