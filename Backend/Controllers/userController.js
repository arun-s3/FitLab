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

const createUser = async(req,res)=>{
    try{
        const {username, email, password, confirmPassword, mobile} = req.body
        if( !username.trim()||!email.trim()||!password.trim()||!mobile.toString().trim() )
        {
            errorHandler(400, "Please enter all the fields")
        }
        const userExists = await User.findOne({email:email})
        console.log("userExists--"+userExists)
        let userData={}
        if(!userExists){
            if(password===confirmPassword){
                const spassword = await securePassword(password)
                const newUser = new User({
                    username,
                    email,
                    password:spassword,
                    mobile,
                    isAdmin:Boolean(false),
                    isVerified:Boolean(false)
             })
                console.log("before newUser.save()--")
                userData = await newUser.save()
                console.log("userData-->"+userData)
            }
            else{
                errorHandler(400, "Password and confirm password doesn't match")
            }
        }
        else{
            errorHandler(409, "User already exists")
        }
       if(userData){
            res.status(201).json({message:"Success!", user:userData})
        }
        else{
            errorHandler(500, "Internal Server Error")
        }
    }
    catch(error){
        // next(error)
        console.log("error-signup--", error.message)
    }
}

const loginUser = async(req,res)=>{
    try{
        const {identifier, password} = req.body
        let username,email=""
        let userData={}
        if(identifier.trim()!==""||password.trim()!=="")
        {
            console.log("inside 1st if")
            errorHandler(400,"Enter all the fields")
        }
        if(identifier.trim().includes("@")){
            const email = identifier
            console.log("inside 2nd if")
            const userData = User.findOne({email:email})
            console.log("userData inside loginuser-->"+userData)
            if(!userData){
                errorHandler(401, "Enter a valid email id")
            }
        }
        else{
            username = identifier
            console.log("Inside else")
            userData = await User.findOne({username:username})
            if(!userData){
                errorHandler(401, "Enter a valid username")
            }
        }
        const test = username??email
        console.log("username or email-->"+test)
        console.log("password-->"+userData.password)
        const passwordMatched = await bcryptjs.compare(password, userData.password)
        console.log("passwordMatchd-->"+passwordMatched)
        if(passwordMatched){
            const token = generateToken(res,userData._id)
            console.log("token-->"+token)
            res.status(200).json({message:"Logged in successfully!",token:token, user:userData})
        }
      }
 catch(error){
    console.log("Login error-->"+error)
 } 

}



module.exports = {tester, createUser, loginUser}