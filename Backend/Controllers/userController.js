const User = require('../Models/userModel')
const bcryptjs = require('bcryptjs')
const nodemailer = require("nodemailer");
// const crypto = require("crypto");
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

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "fitlab0101@gmail.com", 
      pass: process.env.FITLABPASS, 
    },
  })
  
  const sendOtp = async (req, res, next) => {
    const {email} = req.body
    console.log("Email frm the body--->", email)
    console.log("process.env.FITLABPASS--->", process.env.FITLABPASS)
    if (!email) {
      return res.status(400).json({message: "Email is required!"});
    }
  
    const otp = Math.floor(10000 + Math.random() * 90000);
    req.session.otp = otp;
    req.session.email = email; 
    req.session.otpExpiresAt = Date.now() + 5 * 60 * 1000; 
    console.log("req.session.otpExpiresAt mae at sendOtp--->",req.session.otpExpiresAt)
    try {
      await transporter.sendMail({
        from: "arunsudhakaran01@gmail.com",
        to: email,
        subject: "OTP Code Verification",
        text: `Your OTP code is ${otp}. It would be expired in 5 minutes.`,
      })
      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) { 
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Error sending OTP email" });
    }
  }

  const verifyOtp = async(req, res, next) => {
    try{
        console.log("Inside verifyOtp")
        const {otp, email, updateUser} = req.body
        console.log("OTP to verify---->", otp)
        console.log("req.session.otpExpiresAt now in verifyOtp--->",req.session.otpExpiresAt)
        console.log("Date.now()----->", Date.now())
        console.log("Date.now() > req.session.otpExpiresAt----->", Date.now() > req.session.otpExpiresAt)

        if (!otp) {
        //   return res.status(400).json({ message: "OTP is required!" })
          next(errorHandler(400, "OTP is required!"))
        }
        if (!req.session.otp || !req.session.email) {
        //   return res.status(400).json({ message: "No OTP found to verify!" })
          next(errorHandler(400, "No OTP found to verify!"))
        }
        if (Date.now() > req.session.otpExpiresAt) {
        //   return res.status(400).json({ message: "OTP has expired!" });
            next(errorHandler(400, "OTP has expired!"))
        }
    
        if (parseInt(otp, 10) === req.session.otp) {
          req.session.otp = null;
          req.session.email = null;
          req.session.otpExpiresAt = null;
          
          if(updateUser){
            console.log("Updateding user...")
            const user = await User.updateOne({email}, {$set: {isVerified: true}})
          }
          return res.status(200).json({ message: "OTP verified successfully!" });
        }else{
          console.log("INAVLID OTP!")
          next(errorHandler(400, "Invalid OTP!"))
        }
     }
     catch(error){
        next(error)
        console.log("error-verifyOtp--", error.message)
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


// function generateOTP(length = 6) {
//     return crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
// }

// async function sendOTPEmail(email, otp) {
//     const transporter = nodemailer.createTransport({
//         service: "gmail", 
//         auth: {
//             user: "fitlab0101@gmail.com",
//             pass: process.env.FITLABPASS, 
//         },
//     })
//     const mailOptions = {
//         from: "fitlab0101@gmail.com",
//         to: email,
//         subject: "OTP Verification",
//         text: `Your OTP is ${otp}. It will get expired within 5 minutes.`,
//     }

//     await transporter.sendMail(mailOptions);
// }

const loginUser = async(req,res,next)=>{
    try{
        console.log("req.cookies from loginUser controller-->"+JSON.stringify(req.cookies))
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
                    // console.log("from signin controller--JWT Cookie inserted-->"+res.cookies)
                    res.status(200).json({message:"Logged in successfully!",token:token, user:userData})
                  }
                else{
                    next(errorHandler(401, "You have entered a wrong password!"))
                  }  
            }
                 
           }
        }
 catch(error){
    console.log("Login error-->"+error)
    next(error)
 } 

}

const updateUserDetails = async (req, res, next) => {
  try {
    const userId = req.user._id
    const {userDetails} = req.body

    if (!userDetails.username || !userDetails.email){
      next(errorHandler(404, "Username and email are required!"))
    }

    const existingUser = await User.findOne({
      $or: [{ email: userDetails.email }, { mobile: userDetails.mobile }], 
      _id: { $ne: userId }
    })
    if(existingUser){
        next(errorHandler(409, "Email or mobile number already exists for another user!"))
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: userDetails },{ new: true, runValidators: true })
    if (!updatedUser) {
      next(errorHandler(404, "User not found!"))
    }
    res.status(200).json({ message: "User details updated successfully.", user: updatedUser})
  }catch(error){
    console.error("Error updating user details:", error.message)
    next(error)
  }
}

const updateForgotPassword = async (req, res, next)=> {
    try {
        console.log("Inside updateForgotPassword")
        const {newPassword} = req.body
        const userId = req.user._id
        console.log(`userId---> ${userId}`)

        if (!newPassword){
            console.log("New password is required")
            return next(errorHandler(400, "New password is required"))
        }
        const user = await User.findById(userId)
        if (!user){
            console.log("User not found")
            return next(errorHandler(404, "User not found"))
        }

        const spassword = await securePassword(newPassword)
        await User.updateOne({_id: userId}, {password: spassword})

        res.status(200).json({message: "Password updated successfully"})
    }catch (error){
        console.error("updatePassword error -->", error.message)
        next(error)
    }
}

const resetPassword = async (req, res, next)=> {
  try {
      console.log("Inside resetPassword controller")
      const {currentPassword, newPassword, confirmPassword} = req.body
      const userId = req.user._id

      if (!currentPassword || !newPassword || !confirmPassword) {
          console.log("All fields are required!")
          return next(errorHandler(400, "Please provide all the fields."))
      }

      const user = await User.findOne({ _id: userId })
      if(!user){
          console.log("User not found!")
          return next(errorHandler(404, "User not found."))
      }
      const isMatch = await bcryptjs.compare(currentPassword, user.password)
      if (!isMatch) {
          console.log("Current password is incorrect!")
          return next(errorHandler(401, "Current password is incorrect."))
      }

      if (newPassword !== confirmPassword) {
          console.log("New password and confirmed password do not match!")
          return next(errorHandler(400, "New password and confirmed password do not match."))
      }

      const hashedNewPassword = await securePassword(newPassword)
      user.password = hashedNewPassword
      await user.save()
      console.log("Password updated successfully!");
      res.status(200).json({ message: "Password updated successfully!" })
  }catch(error){
      console.error("Error in resetPassword", error.message);
      next(error)
  }
}

const googleSignin = async(req,res,next)=>{
    try{
        const {username, email, sub:googleId, picture:profilePic} = req.body
        console.log("username-->"+ username+ "email--> "+ email+ "googleId(sub) -->"+ googleId+ "profilePic(picture)"+ profilePic)
        if(googleId){
            const token = generateToken(res, googleId)
            console.log("Token made from googleToken from backend-->"+token)
            console.log("COOKIE made from googleSignin backend-->"+req.cookies.jwt)
            if(token){
                console.log("Success from backend, res sent")
                res.json({message:"success", token, user:{username,email,googleId,profilePic}})
            }
            else{
                console.log("500 error")
                next(errorHandler(500,"Internal Server Error"))
            }
        }
        else{
                console.log("401 error")
                next(errorHandler(401,"Unauthorized!"))
        }
    }
    catch(error){
        console.log("Inside catch of googleSignin controller")
        next(error)
    }
}

const signout = (req,res,next)=>{
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


module.exports = {tester, createUser, sendOtp, verifyOtp, loginUser, updateUserDetails, updateForgotPassword, resetPassword,
     googleSignin, signout}