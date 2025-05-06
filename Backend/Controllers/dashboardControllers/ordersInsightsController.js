const Order = require('../../Models/orderModel')

const {errorHandler} = require('../../Utils/errorHandler') 



const getOrdersStats = async (req, res, next)=> {
  try {
    console.log("Inside getOrdersStats")
    const stats = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          deliveredOrders: [
            { $match: { orderStatus: "delivered" } },
            { $count: "count" }
          ],
          pendingOrders: [
            { $match: { orderStatus: "processing" } },
            { $count: "count" }
          ]
        }
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ["$totalOrders.count", 0] }, 0] },
          delivered: { $ifNull: [{ $arrayElemAt: ["$deliveredOrders.count", 0] }, 0] },
          pending: { $ifNull: [{ $arrayElemAt: ["$pendingOrders.count", 0] }, 0] }
        }
      },
      {
        $addFields: {
          fulfillmentRate: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              {
                $round: [
                  { $multiply: [{ $divide: ["$delivered", "$total"] }, 100] },
                  2
                ]
              }
            ]
          }
        }
      }
    ])
    console.log("stats[0]---->", stats[0])

    res.status(200).json({stats: stats[0]});
  }
  catch(error){
    console.error("Error fetching order stats:", error.message)
    next(error)
  }
}


const getMonthlyOrderStats = async (req, res, next)=> {
  try {
    console.log("Inside getMonthlyOrderStats")

    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)

    const statusMapping = {
      processing: "pending",
      confirmed: "pending",
      delivered: "delivered",
      cancelled: "cancelled",
      shipped: "shipped",
      refunded: "refunded"
    }

    const rawStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          status: {
            $cond: {
              if: { $in: ["$orderStatus", ["processing", "confirmed"]] },
              then: "pending",
              else: "$orderStatus"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            month: "$month",
            status: "$status"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const finalStats = months.map((name, index)=> ({
      name,
      delivered: 0,
      pending: 0,
      cancelled: 0,
      shipped: 0,
      refunded: 0
    }))

    rawStats.forEach(({ _id, count }) => {
      const monthIndex = _id.month - 1
      const status = _id.status
      if (finalStats[monthIndex][status] !== undefined) {
        finalStats[monthIndex][status] = count
      }
    })
    console.log("ordersOverTime---->", finalStats)

    res.status(200).json({ordersOverTime: finalStats})
  } 
  catch(error){
    console.error("Error getting monthly order stats:", error.message)
    next(error)
  }
}


const getTopFiveProductsByOrders = async (req, res, next)=> {
  try {
    console.log("Inside getTopFiveProductsByOrders")

    const result = await Order.aggregate([
      { $unwind: "$products" }, 
      {
        $group: {
          _id: {
            productId: "$products.productId",
            title: "$products.title"
          },
          orderCount: { $sum: 1 } 
        }
      },
      {
        $sort: { orderCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 0,
          product: "$_id.title",
          orders: "$orderCount"
        }
      }
    ])

    res.status(200).json({topProductDatas: result});
  }
  catch(error){
    console.error("Error getting top 5 products:", error.message)
    next(error)
  }
}


const getOrderStatusDistribution = async (req, res, next)=> {
  try {
    const rawStatusesToInclude = ['delivered', 'shipped', 'cancelled', 'refunded', 'processing', 'confirmed']

    const statusCounts = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: rawStatusesToInclude }
        }
      },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ])

    const statusBuckets = {
      Delivered: 0,
      Shipped: 0,
      Cancelled: 0,
      Refunded: 0,
      Pending: 0  
    }

    for (const item of statusCounts){
      const status = item._id
      const count = item.count

      if (status === 'processing' || status === 'confirmed') {
        statusBuckets.Pending += count
      } else if (status === 'delivered') {
        statusBuckets.Delivered += count
      } else if (status === 'shipped') {
        statusBuckets.Shipped += count
      } else if (status === 'cancelled') {
        statusBuckets.Cancelled += count
      } else if (status === 'refunded') {
        statusBuckets.Refunded += count
      }
    }

    const totalOrders = Object.values(statusBuckets).reduce((acc, val) => acc + val, 0)

    const result = Object.entries(statusBuckets).map(([key, value])=> ({
      name: key,
      value: totalOrders > 0 ? Math.round((value / totalOrders) * 100) : 0
    }))

    res.status(200).json({orderStatusDistribution: result});
  } 
  catch(error){
    console.error("Error calculating order status percentages:", error.message)
    next(error)
  }
}





module.exports = {getOrdersStats, getMonthlyOrderStats, getTopFiveProductsByOrders, getOrderStatusDistribution}
