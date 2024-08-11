const User = require('../Models/userModel')
const bcryptjs = require('bcryptjs')
const {errorHandler} = require('../Utils/errorHandler')
const {generateToken, verifyToken} = require('../Utils/jwt')

const tester = async(req,res)=>{res.send("UserTest-- Success")}

const securePassword = async(password)=>{
    try{
        return await bcryptjs.hash(password,10)
    }
    catch(error){
        console.log(error)
    }
}

const createUser = async(req,res,next)=>{
    try{
        console.log("Inside backend createuser controller")
        const {username, email, password, confirmPassword, mobile} = req.body
        // console.log("!username.trim()-->"+!username.trim())
        if( !username||!email||!password||!mobile)
        {   
            console.log("Enter all fields!")
            next(errorHandler(400, "Please enter all the fields"))
        }
        else{   
            const userExists = await User.findOne({email:email})
            console.log("userExists--"+userExists)
            let userData={}
            console.log("outside !userExists-->"+!userExists)
            if(!userExists){
                console.log("inside !userExists-->"+!userExists)
                if(password===confirmPassword){
                    const spassword = await securePassword(password)
                    const newUser = new User({
                        username,
                        email,
                        password:spassword,
                        mobile
                })
                    console.log("before newUser.save()--")
                    userData = await newUser.save()
                    console.log("userData-->"+userData)
                }
                else{
                    next(errorHandler(400, "Password and confirm password doesn't match"))
                }
            }
            else{
                console.log("User exists!")
                next(errorHandler(409, "User already exists"))
            }
        if(userData){
            console.log("Just befores response sent-->"+JSON.stringify(userData))
                res.status(201).json({message:"success", user:userData})
                console.log("Response sent from backend-->"+JSON.stringify(userData))
            }
            else{
                next(errorHandler(500, "Internal Server Error"))
            }
        }
        
    }
    catch(error){
        next(error)
        console.log("error-signup--", error.message)
    }
}

const loginUser = async(req,res,next)=>{
    try{
        console.log("Inside backend loginuser controller")
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
                userData = await User.findOne({email:email})
                    console.log("userData inside loginuser-->"+userData)
                if(!userData){
                    next(errorHandler(401, "Enter a valid email id"))
                }
            }
            else{
                    username = identifier
                        console.log("Inside else")
                    userData = await User.findOne({username:username})
                    if(!userData){
                        next(errorHandler(401, "Enter a valid username"))
                    }
            }
            if(userData){
                const test = username?`username=${username}` :`email=${email}`
                    console.log("username or email-->"+test)
                    console.log("password-->"+userData.password)
                const passwordMatched = await bcryptjs.compare(password, userData.password)
                    console.log("passwordMatchd-->"+passwordMatched)
                if(passwordMatched){
                    const token = generateToken(res,userData._id)
                        console.log("token inside signinControllr-->"+token)
                    console.log("userData from backend-->"+userData)
                    res.status(200).json({message:"Logged in successfully!",token:token, user:userData})
                  }
                else{
                    next(errorHandler(401, "Wrong password entered"))
                  }  
            }
                 
           }
        }
 catch(error){
    console.log("Login error-->"+error)
    next(error)
 } 

}

const logout = (req,res,next)=>{
    try{
        res.clearCookie('jwt').status(200).json({message:"signed out"})
        console.log("Sent response from logout controller-->"+JSON.stringify(res))
    }
    catch(error){
        console.log("Error in logout controller--"+error.message)
        next(error)
    }
}

module.exports = {tester, createUser, loginUser, logout}