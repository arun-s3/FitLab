const Order = require('../../Models/orderModel')
const Product = require('../../Models/productModel') 
const Category = require('../../Models/categoryModel')
const User = require('../../Models/userModel')

const {errorHandler} = require('../../Utils/errorHandler') 



const getOrdersStats = async (req, res) => {
  try {
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

    res.status(200).json({stats: stats[0]});
  }
  catch(error){
    console.error("Error fetching order stats:", error.message)
    next(error)
  }
}



module.exports = {getOrdersStats, }
