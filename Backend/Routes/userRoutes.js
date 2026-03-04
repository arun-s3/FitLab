const express = require("express")
const userRouter = express.Router()

const { isLogin, optionalAuth, authorizeAdmin, isLogout } = require("../Middlewares/Authentication")

const upload = require("../Utils/multer")
const {
    createUser,
    createRefreshToken,
    sendOtp,
    verifyOtp,
    loginUser,
    clearAllCookies,
    updateForgotPassword,
    resetPassword,
    updateUserDetails,
    googleSignin,
    updateProfilePic,
    signout,
    getUserId,
    searchUsernames,
    totalUsersCount,
    generateUniqueGuestUser,
    verifyAndDeleteGuestUser,
    updateUserWeight,
    getUserByUsername,
    updateTermsAcceptance,
    googleSignout,
} = require("../Controllers/userController")

userRouter.post("/refresh-token", optionalAuth, createRefreshToken)
userRouter.post("/signup", isLogout, createUser)
userRouter.post("/sendOtp", optionalAuth, sendOtp) 
userRouter.post("/verifyOtp", optionalAuth, verifyOtp)
userRouter.post("/signin", isLogout, loginUser)
userRouter.post("/googleSignin", isLogout, googleSignin)
userRouter.get("/clear-cookies", optionalAuth, clearAllCookies)
userRouter.post("/update", isLogin, updateUserDetails)
userRouter.post("/password/reset", isLogin, updateForgotPassword)
userRouter.post("/password/update", isLogin, resetPassword)
userRouter.put("/profilePic", isLogin, upload.single("image"), updateProfilePic)
userRouter.put("/update/weight", isLogin, updateUserWeight)
userRouter.get("/signout", isLogin, signout)
userRouter.get("/search/:searchTerm", isLogin, authorizeAdmin, searchUsernames)
userRouter.get("/getUserid", isLogin, getUserId)
userRouter.get("/totalUsers", optionalAuth, totalUsersCount)
userRouter.get("/user/:username", isLogin, authorizeAdmin, getUserByUsername)
userRouter.post("/terms", isLogin, updateTermsAcceptance)
userRouter.get("/guest", optionalAuth, generateUniqueGuestUser)
userRouter.get("/guest-check", optionalAuth, verifyAndDeleteGuestUser)

module.exports = userRouter
