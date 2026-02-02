const {verifyToken} = require('../Utils/jwt')
const User = require('../Models/userModel')


const isLogin = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        let decoded
        try {
            decoded = verifyToken(token)
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" })
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
        next(error)
    }
}

const authorizeAdmin = async(req,res,next)=>{
    try{
        console.log("Admin from authorizeAdmin-->"+ JSON.stringify(req.user))
        if(req.user && req.user.isAdmin){
            next()
        }
        else{
            res.status(401).json({message:"Not an Admin!! UNAUTHORIZED!"})
        }
    }
    catch(error){
        console.log("Admin AuthError--"+error.message)
        next(error)
    }
    
}

const isLogout = (req,res,next)=>{
   try{
        if(!req.cookies.jwt){
            next()
        }
        else{
            console.log("Cookies exits, hence logged in!")
            res.status(400).json({message:"Bad request- User already logged in!"})
        }
   }
   catch(error){
       console.log("User AuthError--"+error.message)
       next(error)
  }
}

module.exports = {isLogin, authorizeAdmin, isLogout}