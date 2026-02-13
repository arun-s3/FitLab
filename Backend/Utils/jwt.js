const jwt = require("jsonwebtoken")
const RefreshToken = require("../Models/refreshTokenModel");
const isProd = process.env.NODE_ENV === "production"


const generateAccessToken = (userId) => {
    console.log("Inside generateAccessToken()..")
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )
}

const generateRefreshToken = (userId) => {
    console.log("Inside generateRefreshToken()..")
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "10d" }
    )
}

const sendTokens = async(res, userId) => {
    console.log("Inside sendTokens()..")
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await RefreshToken.create({
        user: userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: isProd ? ".fitlab.co.in" : undefined,
        path: "/",
        maxAge: 15 * 60 * 1000, 
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: isProd ? ".fitlab.co.in" : undefined,
        path: "/",
        maxAge: 10 * 24 * 60 * 60 * 1000, 
    });
}

const verifyAccessToken = (token) => {
    console.log("Inside verifyAccessToken()..")
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

const verifyRefreshToken = (token) => {
    console.log("Inside verifyRefreshToken()..")
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
}


module.exports = { sendTokens, verifyAccessToken, verifyRefreshToken }
