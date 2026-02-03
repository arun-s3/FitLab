const User = require('../Models/userModel')
const Order = require('../Models/orderModel')
const Address = require('../Models/addressModel')
const bcryptjs = require('bcryptjs')
const {errorHandler} = require('../Utils/errorHandler')
const {generateToken, verifyToken} = require('../Utils/jwt')
const user = require('../Models/userModel') // CHECK IF THIS IS NEEDED(MAYBE THE REASON OF OTHER RANDOM ERRORS

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
        const isProd = process.env.NODE_ENV === "production"
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            domain: isProd ? ".fitlab.co.in" : undefined,
        })
        res.status(200).json({ message: "signed out" })
    }
    catch(error){
        console.log("JWT Cookie inside signout controller catch-->"+req.cookies.jwt)
        console.log("Error in signout controller--"+error.message)
        next(error)
    }
}


const showUsers = async (req, res, next) => {
  try {
    console.log("Inside getAllUsers of userController")

    let { page = 1, limit = 6, searchData, status = "all" } = req.body.queryOptions

    console.log("req.body.queryOptions------------->", JSON.stringify(req.body.queryOptions))

    page = parseInt(page)
    limit = parseInt(limit)

    const skip = (page - 1) * limit

    const filter = { isAdmin: false }
    if (searchData) {
      filter.username = { $regex: searchData, $options: "i" }
    }

    if (status.toLowerCase() !== "all") {
      filter.isBlocked = status.toLowerCase() === "blocked"
    }

    const users = await User.aggregate([
      { $match: filter },

      {
        $lookup: {
          from: "wallets",
          localField: "_id",
          foreignField: "userId",
          as: "wallet",
        },
      },

      {
        $addFields: {
          walletBalance: {
            $ifNull: [{ $arrayElemAt: ["$wallet.balance", 0] }, 0]
          }
        },
      },

      {
        $project: {
          password: 0,
          wallet: 0,
        },
      },

      { $skip: skip },
      { $limit: limit }
    ]);

    const totalUsers = await User.countDocuments(filter)

    console.log("totalUsers------------->", totalUsers)

    return res.status(200).json({
      success: true,
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });

  }
  catch (error) {
    console.error("Error fetching users:", error.message)
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


const updateRiskyUserStatus = async (req, res, next)=> {
  try {
    console.log("Inside updateRiskyUserStatus of userController")

    const { userId } = req.params
    const { riskyUserStatus, riskyUserNotes } = req.body.riskDetails

    console.log("Updating risky status for user:", userId)

    const user = await User.findById(userId)
    if (!user) {
      return next(errorHandler(404, "User not found!"))
    }

    if(typeof riskyUserStatus === "boolean" && riskyUserStatus === true){
        if (!riskyUserNotes?.trim()) {
          return next(errorHandler(404, "Please provide the user's suspicious activities!"))
        }
        user.riskyUserStatus = true
        user.isBlocked = true
    }

    if(typeof riskyUserStatus === "boolean" && riskyUserStatus === false){
        user.riskyUserStatus = false
    }

    if (riskyUserNotes?.trim() && riskyUserNotes.length > 1) {
      user.riskyUserNotes = riskyUserNotes
    }

    await user.save();

    return res.status(200).json({
        success: true,
        message: riskyUserStatus ? "The user has been marked suspicious" : "User is no longer suspicious!",
        updatedUser: user
    });
  }
  catch (error) {
    console.error("Error updating risky user status:", error.message)
    next(error)
  }
}


const getUserStats = async (req, res, next) => {
  try {
    console.log("Inside getUserStats of userController")
    const {userId} = req.params

    const orders = await Order.find({ userId }).sort({ createdAt: -1 })

    if (!orders.length) {
      const address =
        (await Address.findOne({ userId, defaultAddress: true })) ||
        (await Address.findOne({ userId }));

      return res.status(200).json({
        success: true,
        stats: {
          totalOrders: 0,
          activeOrders: 0,
          totalReturns: 0,
          totalRefunds: 0,
          totalCancelled: 0,
          totalProductsReturned: 0,
          totalProductsRefunded: 0,
          totalProductsCancelled: 0,
          totalMoneySpent: 0,
          totalMoneySaved: 0,
          lastOrder: null,
          address: address || null,
        },
      });
    }

    let totalMoneySpent = 0
    let totalMoneySaved = 0

    let activeOrders = 0
    let totalReturns = 0
    let totalRefunds = 0
    let totalCancelled = 0

    let totalProductsReturned = 0
    let totalProductsRefunded = 0
    let totalProductsCancelled = 0

    orders.forEach((order) => {
      if (order.orderStatus !== "cancelled") {
        totalMoneySpent += order.absoluteTotalWithTaxes || 0
      }

      totalMoneySaved += order.couponDiscount || 0
      totalMoneySaved += order.discount || 0

      order.products.forEach((p) => {
        totalMoneySaved += p.offerDiscount || 0

        if (p.productStatus === "returning" && p.productReturnStatus === "accepted") {
          totalProductsReturned++
        }

        if (p.productStatus === "refunded") {
          totalProductsRefunded++
        }

        if (p.productStatus === "cancelled") {
          totalProductsCancelled++
        }
      })

      if (["processing", "confirmed", "shipped"].includes(order.orderStatus)) {
        activeOrders++
      }

      if (
        (order.orderStatus === "returning" && order.orderReturnStatus === "accepted") ||
        order.products.some((p) => p.productStatus === "returning" && p.productReturnStatus === "accepted")
      ) {
        totalReturns++
      }

      if (
        order.orderStatus === "refunded" ||
        order.products.some((p) => p.productStatus === "refunded")
      ) {
        totalRefunds++
      }

      if (
        order.orderStatus === "cancelled" ||
        order.products.some((p) => p.productStatus === "cancelled")
      ) {
        totalCancelled++
      }
    });

    const lastOrder = orders[0]

    const address =
      (await Address.findOne({ userId, defaultAddress: true })) ||
      (await Address.findOne({ userId }))

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders: orders.length,
        activeOrders,
        totalReturns,
        totalRefunds,
        totalCancelled,

        totalProductsReturned,
        totalProductsRefunded,
        totalProductsCancelled,

        totalMoneySpent,
        totalMoneySaved,
        lastOrder,
      },
      address: address || null
    });
  }
  catch (error) {
    console.log("Dashboard Error:", error.message)
    next(error)
  }
}



module.exports = {tester, signinAdmin, signoutAdmin, showUsers, showUsersofStatus, toggleBlockUser, updateRiskyUserStatus, 
    getUserStats}