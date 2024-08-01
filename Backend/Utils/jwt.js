const jwt = require('jsonwebtoken')

const generateToken = (res,userId)=>{
    try{
        console.log("Inside generateToken")
        const token = jwt.sign({userId}, process.env.JWTSECRET, {expiresIn:'10d'})
        console.log("Token mande-->"+token)
        res.cookie(jwt,token,{
            expires:10*24*60*60,
            httpOnly:true,
            sameSite:'strict'
        })
        return token
    }
    catch(error){
        error.statusCode = error.statusCode||500
        error.message = error.message + "---Internal Server Error"
    }
}

const verifyToken = (token)=>{
    try{
        const tokenVerified = jwt.verify(token,process.env.JWTSECRET,(err,decoded)=>{
            if(error){
                return false
            }
            else return decoded
        })
        return tokenVerified
    }
    catch(error){
        error.statusCode = error.statusCode||401
        error.message = error.message + "---Unauthorized user"
    }
    
}

module.exports = {generateToken, verifyToken}