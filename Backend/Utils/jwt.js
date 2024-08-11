const jwt = require('jsonwebtoken')

const generateToken = (res,userId)=>{
    try{
        console.log("Inside generateToken")
        const token = jwt.sign({userId}, process.env.JWTSECRET, {expiresIn:'10d'})
        console.log("Token made token inside jwt-->"+token)
        res.cookie('jwt',token,{
            expires:new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            httpOnly:true,
            sameSite:'strict'
        })
        return token
    }
    catch(error){
        error.statusCode = error.statusCode||500
        error.message = error.message + "---Internal Server Error"
        console.log(error)
    }
}

const verifyToken = (token)=>{
    try{
        const tokenVerified = jwt.verify(token,process.env.JWTSECRET,(err,decoded)=>{
            if(err){
                console.log("error inside verifyToken in jwt"+err.message)
                return false
            }
            else {
                console.log("decoded token payload from verifyToken in jwt"+decoded)
                return decoded
            }
        })
        return tokenVerified
    }
    catch(error){
        error.statusCode = error.statusCode||401
        error.message = error.message + "---Unauthorized user"
    }
    
}

const deleteToken = (res)=>{
    res.clearCookie('jwt').status(200).json({message:"signed out"})
}
module.exports = {generateToken, verifyToken}