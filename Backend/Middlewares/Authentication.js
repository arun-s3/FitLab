const {verifyToken} = require('../Utils/jwt')
const User = require('../Models/userModel')

const isLogin = async(req,res,next)=>{
    try{
        console.log("Inside isLogin JWT Cookie-->"+req.cookies.jwt)
        if(req.cookies.jwt){
            const token = req.cookies.jwt
            console.log("Inside isLogin extracted token from cookie inside isLogin-->"+token)
            const decoded = verifyToken(token)
            console.log("Inside isLogin Verifying token inside isLogin-->"+decoded)
            if(decoded){
                const currentUser = await User.findOne({_id:decoded.userId})
                if(currentUser.isBlocked){ 
                    res.status(401).json({message:"You are Blocked! For more info, contact us"})
                }
                else{
                    req.user = currentUser._id
                    next()
                }
            }
            else{
                console.log("Inside isLogin Can't verify token")
                res.status(401).json({message:"Unauthorized!"})
            }
        }
        else{
            console.log("Inside isLogin Can't find jwt cookie")
            res.status(401).json({message:"Unauthorized!"})
        }
    }
    catch(error){
        console.log("User AuthError--"+error.message)
        next(error)
    }
}

const authorizeAdmin = async(req,res,next)=>{
    try{
        if(req.user && req.user.isAdmin){
            next()
        }
        else{
            res.status(401).json({message:"Unauthorized!"})
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
            res.status(400).json({message:"Bad request- User already logged in!"})
        }
   }
   catch(error){
       console.log("User AuthError--"+error.message)
       next(error)
  }
}

module.exports = {isLogin, authorizeAdmin, isLogout}