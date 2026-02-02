const jwt = require("jsonwebtoken");
const isProd = process.env.NODE_ENV === "production"

const generateToken = (res, userId) => {
    try {
        console.log("Inside generateToken");
        const token = jwt.sign({ userId }, process.env.JWTSECRET, {
            expiresIn: "10d",
        });
        console.log("Token made token inside jwt-->" + token);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            domain: isProd ? ".fitlab.co.in" : undefined,
            maxAge: 10 * 24 * 60 * 60 * 1000,
        })
        return token;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        error.message = error.message + "---Internal Server Error";
        console.log(error);
    }
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWTSECRET)
    } catch (error) {
        console.log("JWT verification failed:", error.message)
        return null
    }
}


module.exports = { generateToken, verifyToken };
