const Order = require('../../Models/orderModel')
const User = require('../../Models/userModel')

const {errorHandler} = require('../../Utils/errorHandler') 




const getUserMetrics = async (req, res, next)=> {
  try {
    console.log("Inside getUserMetrics")

    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const totalUsers = await User.countDocuments({isBlocked: false})

    const orderCounts = await Order.aggregate([
      {
        $match: {
          createdAt: {$gte: oneMonthAgo}
        }
      },
      {
        $group: {
          _id: "$userId",
          orderCount: {$sum: 1}
        }
      }
    ])
    console.log("orderCounts-->", JSON.stringify(orderCounts))

    let newUsers = 0
    let returningUsers = 0

    for (const user of orderCounts) {
      if (user.orderCount <= 1) newUsers++
      else returningUsers++
    }

    const activeUsers = newUsers + returningUsers
    const returningRate = activeUsers > 0 ? Math.round((returningUsers / activeUsers) * 100) : 0
    console.log(`totalUsers---->${totalUsers},newUsers----> ${newUsers} returningRate----> ${returningRate}%`)

    res.status(200).json({totalUsers, newUsers, returningRate})

  }
  catch(error){
    console.error("Error calculating user metrics:", error.message)
    next(error)
  }
}


const getUserTypePercentages = async (req, res, next)=> {
  try {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const allUsers = await User.find({isBlocked: false}, '_id')
    const userIdList = allUsers.map(user=> user._id.toString())

    const recentOrderStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: oneMonthAgo }
        }
      },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 }
        }
      }
    ])

    const newUsersSet = new Set()
    const returningUsersSet = new Set()

    for (const stat of recentOrderStats) {
      const userId = stat._id.toString()
      if (stat.orderCount <= 1) newUsersSet.add(userId)
      else returningUsersSet.add(userId)
    }

    const totalSpendStats = await Order.aggregate([
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$absoluteTotalWithTaxes" }
        }
      }
    ])

    const vipUsersSet = new Set()
    for (const stat of totalSpendStats) {
      const userId = stat._id.toString()
      if (stat.totalSpent >= 300000) {
        vipUsersSet.add(userId)
      }
    }

    const totalUsers = userIdList.length

    const newUsers = [...newUsersSet].filter(id => userIdList.includes(id)).length
    const returningUsers = [...returningUsersSet].filter(id => userIdList.includes(id)).length
    const vipUsers = [...vipUsersSet].filter(id => userIdList.includes(id)).length

    const percentage = count => totalUsers ? Math.round((count / totalUsers) * 100) : 0

    const result = [
      { name: "New Customers", value: percentage(newUsers) },
      { name: "Returning Customers", value: percentage(returningUsers) },
      { name: "VIP Customers", value: percentage(vipUsers) }
    ]

    return res.status(200).json({userTypesDatas: result});
  }
  catch(error){
    console.error("Error fetching user type percentages:", error.message)
    next(error)
  }
}


const getMonthlyCustomersGrowth = async(req, res, next)=> {
  try {
    console.log("Inside getMonthlyCustomerGrowth")
    const currentYear = new Date().getFullYear()

    const monthlyData = await User.aggregate([
      {
        $match: {
          isBlocked: false,
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          customers: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          customers: 1
        }
      }
    ])

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const result = months.map((name, index)=> {
      const found = monthlyData.find(m => m.month === index + 1)
      return {
        name,
        customers: found ? found.customers : 0
      };
    })
    console.log("monthlyUserGrowth--->", result)

    res.status(200).json({monthlyUserGrowthData: result});
  }
  catch(error){
    console.error("Error in getMonthlyCustomerGrowth:", error.message)
    next(error)
  }
}


const getTopVIPCustomers = async (req, res) => {
  try {
    console.log("Inside getTopVIPCustomers")

    const vipThreshold = 300000; 

    const vipCustomerDatas = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ['delivered', 'confirmed', 'shipped'] },
          'paymentDetails.paymentStatus': 'completed'
        }
      },
      {
        $group: {
          _id: '$userId',
          orders: { $sum: 1 },
          spent: { $sum: '$absoluteTotalWithTaxes' }
        }
      },
      {
        $match: {
          spent: { $gte: vipThreshold }
        }
      },
      {
        $sort: { spent: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users', 
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          name: '$user.username',
          orders: 1,
          spent: 1
        }
      }
    ])
    console.log("vipCustomerDatas---->", vipCustomerDatas)

    res.status(200).json({vipCustomerDatas});
  }
  catch(error){
    console.error('Error fetching VIP customers:', error.message)
    next(error)
  }
}





module.exports = {getUserMetrics, getUserTypePercentages, getMonthlyCustomersGrowth, getTopVIPCustomers}
