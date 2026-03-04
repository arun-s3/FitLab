const { verifyAccessToken } = require("../Utils/jwt")
const User = require("../Models/userModel")


const isLogin = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
        if (!token) {
            return res.status(401).json({ message: "Unauthorized", guest: true })
        }

        let decoded
        try {
            decoded = verifyAccessToken(token)
        } catch (err) {
            return res.status(401).json({ message: "Access token expired" })
        }

        const currentUser = await User.findById(decoded.userId).select("-password")
        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        if (currentUser.isBlocked) {
            return res.status(403).json({
                message: "You are Blocked! For more info, contact support",
            })
        }

        req.user = currentUser
        next()
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken

        if (!token) {
            req.user = null
            return next()
        }

        const decoded = verifyAccessToken(token)
        const currentUser = await User.findById(decoded.userId).select("-password")

        req.user = currentUser || null
        next()
    } catch {
        req.user = null
        console.error(error)
        next()
    }
}


const authorizeAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.isAdmin) {
            next()
        } else {
            res.status(403).json({ message: " Since you are not an Admin, you are unauthorized!" })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const isLogout = (req, res, next) => {
    try {
        if (!req.cookies.accessToken) {
            next()
        } else {
            res.status(400).json({ message: "Bad request- User already logged in!" })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}


module.exports = { isLogin, optionalAuth, authorizeAdmin, isLogout }
