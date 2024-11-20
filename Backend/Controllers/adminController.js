const User = require('../Models/userModel')
const bcryptjs = require('bcryptjs')
const {errorHandler} = require('../Utils/errorHandler')
const {generateToken, verifyToken} = require('../Utils/jwt')
const user = require('../Models/userModel')

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

const showUsers = async(req,res,next)=>{
    try{
        console.log("Inside showUsers controller")
        const users = await User.find({isAdmin:false},{password:0})
        if(users){
            console.log("Users found-->"+JSON.stringify(users))
            res.status(200).json({users:users})
        }
        else{
            console.log("No records!")
            res.status(404).json({message:"Users not found!"})
        }
    }
    catch(error){
        console.log("Inside catch of showUsers controller")
        next(error)
    }
}

const showUsersofStatus = async(req,res,next)=> {
    try{
        const {status} = req.query
        let users = []
        console.log("Status from query-->", status)
        if(status !== 'all'){
            const blockedStatus = status == 'blocked'? true : false
            console.log("blockedStatus-->", blockedStatus)
            users = await User.find({isBlocked: blockedStatus, isAdmin: false}, {password: 0})
        }else{
            users = await User.find({isAdmin: false},{password: 0})
        }
        if(users){
            res.status(200).json({users})
        }
    }
    catch(error){
        console.log("Inside catch of showUserTypes controller")
        next(error)
    }
}

const deleteUser = async(req,res,next)=>{
    try{
        console.log("Inside deleteUser controller")
        const {id} = req.query 
        const userData = await User.findOne({_id:id},{password:0})
        console.log("User-->"+JSON.stringify(userData))
        if(userData){
            if(userData.isAdmin){
                res.status(403).json({message:"Can't delete Admin"})
            }
            else{
                await User.deleteOne({_id:id})
                res.status(200).json({message:"Successfully deleted!"})
            }
        }   
        else{
            next(errorHandler(400,"User not found!"))
        }
    }
    catch(error){
        console.log("Inside deleteUser controller")
        next(error)
    }
}

const deleteUserList = async(req,res,next)=>{
    try{
        console.log("Inside deleteUserList controller")
        console.log("req,body-->"+JSON.stringify(req.body))
        const {userList} = req.body
        console.log('userLIst-->'+JSON.stringify(userList))
        const userDocs = []
        for(let i=0; i<userList.length; i++){
            console.log("inside for-loop of deleteUserList controller")
            userDocs[i] = await User.findOne({_id:userList[i]},{password:0})
            console.log("userList[i]-->"+userList[i])
            console.log("userDocs[i]-->"+JSON.stringify(userDocs))
        }
        console.log("userDocs after for-loop-->"+userDocs)
        console.log("userDocs.filter(doc=>doc.isAdmin)-->"+userDocs.filter(doc=>!doc.isAdmin))
        if(userDocs.filter(doc=>!doc.isAdmin)){
            if(userDocs && userDocs.length==userList.length){
                for(let i=0; i<userList.length; i++){
                    User.deleteOne({_id:userList[i]}).exec().then(result=>{
                        console.log("Deleted successfully--"+result)
                        res.status(200).json({message:"Successfully deleted!"})}).catch(error=>console.log("Error during deletion--"+error))
                    
                }
            }
            else{
                next(errorHandler(400,"Some users not found!"))
            }
        }
        else{
            next(errorHandler(403,"Admin cannot be deleted!"))
        }
    }
    catch(error){
        next(error)
    }
}

const toggleBlockUser = async(req,res,next)=>{
    try{
        console.log("Inside toggleBlockUser controller")
        const {id} = req.query
        const user = await User.findOne({_id:id},{password:0})
        if(user){
            console.log("User-->"+JSON.stringify(user))
            if(!user.isAdmin){
                await User.updateOne({_id:id},{$set:{isBlocked:!user.isBlocked}}).exec().then(doc=>{
                        console.log("Updated user!")
                        res.status(200).json({message:`Succesfully ${!user.isBlocked? 'Blocked!':'Unblocked!'}`})
                }).catch(error=>{
                        next(error)
                })
                    
                }
        }
        else{
            next(errorHandler(400,"User not found!"))
        }
    }
    catch(error){
        console.log("Inside toggleBlockUser controller")
        next(error)
    }
}

module.exports = {tester, signinAdmin, signoutAdmin, showUsers, showUsersofStatus, deleteUser, deleteUserList, toggleBlockUser}