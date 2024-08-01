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
                res.status(201).json({message:"Success!", user:userData})
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
                        console.log("token-->"+token)
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



module.exports = {tester, createUser, loginUser}