const jwt = require('jsonwebtoken')

const generateToken = async(res,userId)=>{
    try{
        console.log("Inside generateToken")
        const token = jwt.sign({userId}, process.env.JWTSECRET, {expiresIn:'10d'})
        console.log("Token mande-->"+token)
        return token
    }
    catch(error){
        error.statusCode = error.statusCode||500
        error.message = error.message + "---Internal Server Error"
    }
}

const verifyToken = async(res, token)=>{
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