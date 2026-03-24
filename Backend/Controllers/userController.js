const User = require("../Models/userModel")
const bcryptjs = require("bcryptjs")
const nodemailer = require("nodemailer")
const cloudinary = require("../Utils/cloudinary")
const RefreshToken = require("../Models/refreshTokenModel")
const HealthProfile = require("../Models/healthProfileModel")

const { errorHandler } = require("../Utils/errorHandler")
const { sendTokens, verifyRefreshToken } = require("../Utils/jwt")
const { encryptData } = require("../Controllers/controllerUtils/encryption")


const securePassword = async (password) => {
    try {
        return await bcryptjs.hash(password, 10)
    } catch (error) {}
}


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.FITLAB_MAIL,
        pass: process.env.FITLABPASS,
    },
})


const sendOtp = async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ message: "Email is required!" })
    }

    const otp = Math.floor(10000 + Math.random() * 90000)
    req.session.otp = otp
    req.session.email = email
    req.session.otpExpiresAt = Date.now() + 5 * 60 * 1000
    try {
        await transporter.sendMail({
            from: "FitLab <fitlab0101@gmail.com>",
            to: email,
            subject: "OTP Code Verification",
            text: `Your OTP code is ${otp}. It would be expired in 5 minutes.`,
        })
        return res.status(200).json({ message: "OTP sent successfully" })
    } catch (error) {
        console.error("Error sending email:", error)
        return res.status(500).json({ message: "Error sending OTP email" })
    }
}


const verifyOtp = async (req, res, next) => {
    try {
        const { otp, email, updateUser } = req.body
        if (!otp) {
            next(errorHandler(400, "OTP is required!"))
        }
        if (!req.session.otp || !req.session.email) {
            next(errorHandler(400, "No OTP found to verify!"))
        }
        if (Date.now() > req.session.otpExpiresAt) {
            next(errorHandler(400, "OTP has expired!"))
        }

        if (parseInt(otp, 10) === req.session.otp) {
            req.session.otp = null
            req.session.email = null
            req.session.otpExpiresAt = null

            if (updateUser) {
                const user = await User.updateOne({ email }, { $set: { isVerified: true } })
            }
            return res.status(200).json({ message: "OTP verified successfully!" })
        } else {
            next(errorHandler(400, "Invalid OTP!"))
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const createRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            next(errorHandler(401, "No refresh token"))
        }

        const storedToken = await RefreshToken.findOne({ token: refreshToken })
        if (!storedToken) {
            return next(errorHandler(403, "Refresh token not recognized"))
        }

        let decoded
        try {
            decoded = verifyRefreshToken(refreshToken)
        } catch (err) {
            next(errorHandler(403, "Invalid refresh token"))
        }

        await sendTokens(res, decoded.userId)

        res.status(200).json({ message: "Token refreshed" })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const createUser = async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword, mobile } = req.body
        if (!username || !email || !password || !mobile) {
            next(errorHandler(400, "Please enter all the fields"))
        } else {
            const userExists = await User.findOne({ email: email })
            let userData = {}
            if (!userExists) {
                if (password === confirmPassword) {
                    const mobileExists = await User.findOne({ mobile })
                    const usernameExists = await User.findOne({ username })
                    if (mobileExists) {
                        return next(errorHandler(409, "Mobile number already exists!"))
                    }
                    if (usernameExists) {
                        return next(errorHandler(409, "Username already exists!"))
                    }
                    const spassword = await securePassword(password)
                    const newUser = new User({
                        username,
                        email,
                        password: spassword,
                        mobile,
                    })
                    userData = await newUser.save()
                } else {
                    return next(errorHandler(400, "Password and confirm password doesn't match"))
                }
            } else {
                return next(errorHandler(409, "User already exists"))
            }
            if (userData) {
                const token = await sendTokens(res, userData._id)
                res.status(201).json({ message: "success", user: userData })
            } else {
                next(errorHandler(500, "Internal Server Error"))
            }
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const loginUser = async (req, res, next) => {
    try {
        const { identifier, password } = req.body
        let username,
            email = ""
        let userData = {}
        if (!identifier || !password) {
            next(errorHandler(400, "Enter all the fields"))
        } else {
            if (identifier.trim().includes("@")) {
                email = identifier
                userData = await User.findOne({ email: email })
                if (!userData) {
                    next(errorHandler(401, "Enter a valid email id"))
                }
            } else {
                username = identifier
                userData = await User.findOne({ username: username })
                if (!userData) {
                    next(errorHandler(401, "Enter a valid username"))
                }
            }
            if (userData) {
                const test = username ? `username=${username}` : `email=${email}`
                const passwordMatched = await bcryptjs.compare(password, userData.password)
                if (passwordMatched) {
                    const token = await sendTokens(res, userData._id)
                    if (userData.isBlocked) {
                        next(errorHandler(401, `${userData.username} is Blocked!`))
                    }
                    res.status(200).json({ message: "Logged in successfully!", user: userData })
                } else {
                    next(errorHandler(401, "You have entered a wrong password!"))
                }
            }
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const googleSignin = async (req, res, next) => {
    try {
        const { username, email, sub: googleId, picture: profilePic } = req.body
        if (!googleId || !email) {
            return next(errorHandler(401, "Unauthorized"))
        }

        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                username,
                email,
                googleId,
                profilePic,
                password: null,
                authProvider: "google",
            })
        }

        await sendTokens(res, user._id)
        res.json({ message: "success", user })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const updateUserDetails = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { userDetails } = req.body
        if (!userDetails.username || !userDetails.email) {
            next(errorHandler(404, "Username and email are required!"))
        }

        const existingUser = await User.findOne({
            $or: [{ email: userDetails.email }, { mobile: userDetails.mobile }, { username: userDetails.username }],
            _id: { $ne: userId },
        })
        if (existingUser) {
            next(errorHandler(409, "Email, username or  mobile number already exists for another user!"))
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: userDetails },
            { new: true, runValidators: true },
        )
        if (!updatedUser) {
            next(errorHandler(404, "User not found!"))
        }
        res.status(200).json({ message: "User details updated successfully.", user: updatedUser })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const updateForgotPassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body
        const userId = req.user._id
        if (!newPassword) {
            return next(errorHandler(400, "New password is required"))
        }
        const user = await User.findById(userId)
        if (!user) {
            return next(errorHandler(404, "User not found"))
        }

        const spassword = await securePassword(newPassword)
        await User.updateOne({ _id: userId }, { password: spassword })

        res.status(200).json({ message: "Password updated successfully" })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const resetPassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body
        const userId = req.user._id

        if (!currentPassword || !newPassword || !confirmPassword) {
            return next(errorHandler(400, "Please provide all the fields."))
        }

        const user = await User.findOne({ _id: userId })
        if (!user) {
            return next(errorHandler(404, "User not found."))
        }
        const isMatch = await bcryptjs.compare(currentPassword, user.password)
        if (!isMatch) {
            return next(errorHandler(401, "Current password is incorrect."))
        }

        if (newPassword !== confirmPassword) {
            return next(errorHandler(400, "New password and confirmed password do not match."))
        }

        const hashedNewPassword = await securePassword(newPassword)
        user.password = hashedNewPassword
        await user.save()
        res.status(200).json({ message: "Password updated successfully!" })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const updateProfilePic = async (req, res, next) => {
    try {
        const userId = req.user._id

        if (!req.file) {
            return next(errorHandler(400, "No image has been provided"))
        }

        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "fitlab_users/images",
            resource_type: "image",
            transformation: [{ width: 400, height: 400, crop: "limit" }],
        })

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true, select: "username profilePic email" },
        )

        if (!updatedUser) {
            return next(errorHandler(404, "User not found"))
        }
        return res.status(200).json({
            message: "Profile picture updated successfully",
            profilePic: updatedUser.profilePic,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const updateUserWeight = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { weight } = req.body.userWeight

        if (weight < 1 || weight > 400) {
            return next(errorHandler(400, "Weight must be between 1 and 400 kg!"))
        }

        await User.updateOne({ _id: userId }, { weight })

        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const todayEnd = new Date()
        todayEnd.setHours(23, 59, 59, 999)

        const latestProfile = await HealthProfile.findOne({ userId, date: { $gte: todayStart, $lte: todayEnd } })

        if (latestProfile) {
            latestProfile.weight = weight
            await latestProfile.save()
        } else {
        }

        return res.status(200).json({
            success: true,
            message: "Weight updated successfully!",
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const updateFitnessGoal = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { fitnessGoal } = req.body

        if (!fitnessGoal) {
            return next(errorHandler(400, "Fitness goal is required!"))
        }

        const allowedGoals = [
            "weight_loss",
            "muscle_gain",
            "general_fitness",
            "endurance",
            "strength",
            "flexibility",
            "recovery",
            "not_set",
        ]

        if (!allowedGoals.includes(fitnessGoal)) {
            return next(errorHandler(400, "Invalid fitness goal provided!"))
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { fitnessGoal } },
            { new: true}
        )

        res.status(200).json({
            message: "Fitness goal updated successfully.",
            fitnessGoal,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const clearAllCookies = async (req, res, next) => {
    try {
        const isProd = process.env.NODE_ENV === "production"

        const refreshToken = req.cookies.refreshToken

        if (refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken })
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            domain: isProd ? ".fitlab.co.in" : undefined,
            path: "/",
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            domain: isProd ? ".fitlab.co.in" : undefined,
            path: "/",
        })
        return res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getUserId = async (req, res, next) => {
    try {
        const userId = req.user._id
        const userDoc = await User.findOne({ _id: userId }, { username: 1 })
        const encryptedUserId = encryptData(userId)
        return res.status(200).json({ encryptedUserId, username: userDoc.username })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const searchUsernames = async (req, res, next) => {
    try {
        const searchTerm = req.params.searchTerm
        const usernameDocs = await User.find({ username: { $regex: `^${searchTerm}`, $options: "i" } }).select(
            "username -_id",
        )
        const usernames = usernameDocs.map((doc) => doc.username)
        return res.status(200).json({ usernames })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const totalUsersCount = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ isBlocked: false, isAdmin: false })
        return res.status(200).json({ totalUsers })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getUserByUsername = async (req, res, next) => {
    try {
        const { username } = req.params

        if (!username) {
            return next(errorHandler(400, "Username is required"))
        }

        const user = await User.findOne({ username }).select("-password -__v")

        if (!user) {
            return next(errorHandler(404, "User not found"))
        }

        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const guestUsersByIP = new Map()
const generatedUsernames = new Set()

const generateUniqueGuestUser = (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress
        if (guestUsersByIP.has(ip)) {
            const existing = guestUsersByIP.get(ip)
            return res.status(200).json({ ...existing, role: "guest" })
        }

        let userId, username
        do {
            userId = `guest_${Math.random().toString(36).substring(2, 6)}`
            username = `guest${Math.floor(1000 + Math.random() * 9000)}`
        } while (generatedUsernames.has(username))

        generatedUsernames.add(username)

        const userData = { userId, username }
        guestUsersByIP.set(ip, userData)
        return res.status(200).json({ message: "Guest user created successfully", ...userData })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const verifyAndDeleteGuestUser = async (req, res, next) => {
    try {
        const ip = req.ip
        if (guestUsersByIP.has(ip)) {
            const { userId, username } = guestUsersByIP.get(ip)
            guestUsersByIP.delete(ip)
            return res.status(200).json({ wasGuest: true, credentials: { userId, username } })
        } else {
            return res.status(200).json({ wasGuest: false })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const updateTermsAcceptance = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { hasAcceptedTerms, termsVersion } = req.body.consent

        const user = await User.findById(userId)
        if (!user) {
            return next(errorHandler(404, "User not found"))
        }

        user.hasAcceptedTerms = hasAcceptedTerms

        if (hasAcceptedTerms) {
            user.termsAcceptedAt = new Date()
            user.termsVersion = termsVersion || user.termsVersion
        } else {
            user.termsAcceptedAt = null
            user.termsVersion = null
        }

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Terms acceptance updated successfully",
            hasAcceptedTerms: user.hasAcceptedTerms,
            termsAcceptedAt: user.termsAcceptedAt,
            termsVersion: user.termsVersion,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const signout = async (req, res, next) => {
    try {
        const isProd = process.env.NODE_ENV === "production"

        const refreshToken = req.cookies.refreshToken

        if (refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken })
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            domain: isProd ? ".fitlab.co.in" : undefined,
            path: "/",
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            domain: isProd ? ".fitlab.co.in" : undefined,
            path: "/",
        })

        res.status(200).json({ message: "signed out" })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


module.exports = {
    createRefreshToken,
    createUser,
    sendOtp,
    verifyOtp,
    loginUser,
    clearAllCookies,
    updateUserDetails,
    updateForgotPassword,
    createRefreshToken,
    resetPassword,
    updateProfilePic,
    googleSignin,
    getUserId,
    searchUsernames,
    totalUsersCount,
    getUserByUsername,
    generateUniqueGuestUser,
    updateUserWeight,
    updateFitnessGoal,
    verifyAndDeleteGuestUser,
    updateTermsAcceptance,
    signout,
}