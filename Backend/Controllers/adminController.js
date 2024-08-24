const User = require('../Models/userModel')
const bcryptjs = require('bcryptjs')
const {errorHandler} = require('../Utils/errorHandler')
const {generateToken, verifyToken} = require('../Utils/jwt')

const tester = async(req,res)=>{ res.send("AdminTest-- Success")}


const signinAdmin = async(req,res,next)=>{
    try{
        console.log("req.cookies from signinAdmin controller-->"+JSON.stringify(req.cookies))
        const {identifier, password} = req.body
        let username,email=""
        let userData={}
        if(!identifier||!password)
        {
            console.log("inside 1st if")
            next(errorHandler(400,"Enter all the fields"))
        }
        else{
            if(identifier.trim().includes("@")){
                email = identifier
                console.log("inside 2nd if")
                userData = await User.findOne({email})
                console.log("userData inside signinAdmin-->"+userData)
                if(!userData){
                    next(errorHandler(401, "Enter a valid email id"))
                }
            }
            else{
                    username = identifier
                    console.log("Inside else")
                    userData = await User.findOne({username})
                    if(!userData){
                        next(errorHandler(401, "Enter a valid username"))
                    }
            }
            if(userData){
                const test = username?`username=${username}` :`email=${email}`
                console.log("username or email-->"+test)
                if(userData.isAdmin){
                    console.log("It's Admin")
                    console.log("password-->"+userData.password)
                    const passwordMatched = await bcryptjs.compare(password, userData.password)
                    console.log("passwordMatchd-->"+passwordMatched)
                    if(passwordMatched){
                        const token = generateToken(res,userData._id)
                        console.log("token inside signinControllr-->"+token)
                        console.log("userData from backend-->"+userData)
                        // console.log("from signin controller--JWT Cookie inserted-->"+res.cookies)
                        res.status(200).json({message:"Logged in successfully!",adminToken:token, admin:userData})
                      }
                    else{
                        next(errorHandler(401, "You have entered a wrong password!"))
                      }  
                }
                else{
                    console.log("It's not an Admin")
                    next(errorHandler(403,"Access Denied! Sorry, You are not an admin"))
                }
                
            }
                 
           }
        }
 catch(error){
    console.log("Admin signin error-->"+error)
    next(error)
 } 
}

const signoutAdmin = (req,res,next)=>{
    console.log("Inside signoutAdmin controller")
    console.log("JWT Cookie from signout controller-->"+req.cookies.jwt)
    try{
        res.clearCookie('jwt').status(200).json({message:"signed out"})
    }
    catch(error){
        console.log("JWT Cookie inside signout controller catch-->"+req.cookies.jwt)
        console.log("Error in signout controller--"+error.message)
        next(error)
    }
}

module.exports = {tester, signinAdmin, signoutAdmin}