const Offer = require('../Models/offerModel')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel') 
const Category = require('../Models/categoryModel')
const User = require('../Models/userModel')

const {errorHandler} = require('../Utils/errorHandler') 



const getAnnualRevenueStats = async (req, res, next)=> {
  try {
    console.log("Inside getAnnualRevenueStats")
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const currentDay = now.getDate()

    const startOfCurrentYear = new Date(currentYear, 0, 1)
    const endOfCurrentYear = new Date(currentYear + 1, 0, 1)

    const startOfToday = new Date(currentYear, currentMonth, currentDay)
    const endOfToday = new Date(currentYear, currentMonth, currentDay + 1)
    const startOfYesterday = new Date(currentYear, currentMonth, currentDay - 1)
    const endOfYesterday = new Date(currentYear, currentMonth, currentDay)

    const calculateRevenue = async (startDate, endDate)=> {
      const orders = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lt: endDate },
            orderStatus: { $in: ['delivered'] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$absoluteTotalWithTaxes" }
          }
        }
      ]);
      return orders[0]?.totalRevenue || 0
    }

    const currentYearRevenue = await calculateRevenue(startOfCurrentYear, endOfCurrentYear)
    const todayRevenue = await calculateRevenue(startOfToday, endOfToday)
    const yesterdayRevenue = await calculateRevenue(startOfYesterday, endOfYesterday)

    console.log(`currentYearRevenue---> ${currentYearRevenue}, todayRevenue---> ${todayRevenue}, yesterdayRevenue---->${yesterdayRevenue}`)

    const revenueChangeDay = yesterdayRevenue === 0 ? null : ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    console.log("revenueChangeDay---->", revenueChangeDay)

    return res.status(200).json({
      success: true,
      currentYear: {
        year: currentYear,
        revenue: currentYearRevenue
      },
      changePercentage: revenueChangeDay !== null ? revenueChangeDay.toFixed(2) : "N/A"
    });

  }
  catch(error){
    console.error("Total Revenue stats error:", error.message);
    next(error)
  }
}


const getAverageOrderTotal = async (req, res, next)=> {
  try {
    console.log("Inside getAverageOrderTotal")
    const now = new Date()

    const startOfYesterday = new Date(now)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    startOfYesterday.setHours(0, 0, 0, 0)

    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setDate(endOfYesterday.getDate() + 1);

    const calculateAverage = async (matchCondition = {}) => {
      const result = await Order.aggregate([
        {
          $match: {
            orderStatus: 'delivered',
            ...matchCondition
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$absoluteTotalWithTaxes" },
            orderCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            averageOrderTotal: {
              $cond: [
                { $eq: ["$orderCount", 0] },
                0,
                { $divide: ["$totalRevenue", "$orderCount"] }
              ]
            },
            orderCount: 1
          }
        }
      ]);

      return {
        average: result[0]?.averageOrderTotal || 0,
        orderCount: result[0]?.orderCount || 0
      }
    }

    const { average: allTimeAvg, orderCount: totalOrders } = await calculateAverage()
    const { average: yesterdayAvg, orderCount: yesterdayOrders } = await calculateAverage({
      createdAt: { $gte: startOfYesterday, $lt: endOfYesterday }
    })

    console.log(`allTimeAvg---> ${allTimeAvg}, totalOrders---> ${totalOrders}, yesterdayAvg---->${yesterdayAvg}, yesterdayAvg---->${yesterdayOrders}`)

    const percentageChange = yesterdayAvg === 0 ? null  : ((allTimeAvg - yesterdayAvg) / yesterdayAvg) * 100;
    console.log("percentageChange--->", percentageChange)

    return res.status(200).json({
      success: true,
      averageOrderTotal: parseFloat(allTimeAvg.toFixed(2)),
      totalDeliveredOrders: totalOrders,
      yesterday: {
        averageOrderTotal: parseFloat(yesterdayAvg.toFixed(2)),
        deliveredOrders: yesterdayOrders
      },
      changePercentage: percentageChange !== null ? parseFloat(percentageChange.toFixed(2)) : "N/A"
    });
  } catch (error) {
    console.error("Error calculating average order total:", error.message)
    next(error)
  }
}


const getTotalOrdersCount = async (req, res, next) => {
  try {
    console.log("Inside getTotalOrdersCount")
    const now = new Date();

    const startOfYesterday = new Date(now)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    startOfYesterday.setHours(0, 0, 0, 0)

    const endOfYesterday = new Date(startOfYesterday)
    endOfYesterday.setDate(endOfYesterday.getDate() + 1)

    const totalOrders = await Order.countDocuments({orderStatus: 'delivered'})

    const yesterdayTotalOrders = await Order.countDocuments({
      orderStatus: 'delivered', 
      createdAt: { $gte: startOfYesterday, $lt: endOfYesterday }
    });

    console.log(`totalOrders---> ${totalOrders}, yesterdayTotalOrders---> ${yesterdayTotalOrders}`)

    const changePercentage = yesterdayTotalOrders === 0 ? null
      : ((totalOrders - yesterdayTotalOrders) / yesterdayTotalOrders) * 100

    console.log("changePercentage--->", changePercentage)

    return res.status(200).json({
      success: true,
      totalOrders,
      yesterdayTotalOrders,
      changePercentage: changePercentage !== null ? parseFloat(changePercentage.toFixed(2)) : "N/A"
    });
  }
  catch(error){
    console.error("Error calculating total orders stats:", error.message)
    next(error)
  }
}


const getMonthlyRevenue = async (req, res, next)=> {
  try {
    console.log("Inside getMonthlyRevenue")
    const currentYear = new Date().getFullYear()

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: 'delivered',
          orderDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$orderDate" },
          totalRevenue: { $sum: "$absoluteTotalWithTaxes" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          revenue: "$totalRevenue"
        }
      }
    ]);

    console.log("monthlyRevenue---->", monthlyRevenue)

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const revenueDatas = monthNames.map((name, index)=> {
      const found = monthlyRevenue.find(m => m.month === index + 1);
      return {
        name,
        revenue: found ? found.revenue : 0
      };
    });

    console.log("monthlyRevenue with months---->", revenueDatas)

    res.status(200).json({revenueDatas})
  }
  catch(error){
    console.error("Error fetching monthly revenue:", error)
    next(error)
  }
}





module.exports = {getAnnualRevenueStats, getAverageOrderTotal, getTotalOrdersCount, getMonthlyRevenue}
