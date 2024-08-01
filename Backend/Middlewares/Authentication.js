const {verifyToken} = require('../Utils/jwt')
const User = require('../Models/userModel')

const isLogin = async(req,res,next)=>{
    try{
        if(req.cookies.jwt){
            const token = req.cookies.jwt
            const decoded = verifyToken(token)
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
                res.status(401).json({message:"Unauthorized!"})
            }
        }
        else{
            res.status(401).json({message:"Unauthorized!"})
        }
    }
    catch(error){
        console.log("AuthError--"+error.message)
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
    }
    
}

module.exports = {isLogin, authorizeAdmin}