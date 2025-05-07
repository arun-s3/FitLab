const Order = require('../../Models/orderModel')
const Category = require('../../Models/categoryModel')


const {errorHandler} = require('../../Utils/errorHandler') 



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
      const found = monthlyRevenue.find(m=> m.month === index + 1);
      return {
        name,
        revenue: found ? found.revenue : 0
      };
    });

    console.log("monthlyRevenue with months---->", revenueDatas)

    res.status(200).json({revenueDatas})
  }
  catch(error){
    console.error("Error fetching monthly revenue:", error.message)
    next(error)
  }
}


const getWeeklyRevenue = async (req, res, next)=> {
  try {
    console.log("Inside getWeeklyRevenue")
    const today = new Date()
    const lastWeek = new Date()
    lastWeek.setDate(today.getDate() - 6)

    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: 'delivered',
          orderDate: {
            $gte: new Date(lastWeek.setHours(0, 0, 0, 0)),
            $lte: new Date(today.setHours(23, 59, 59, 999))
          }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$orderDate" },
          totalRevenue: { $sum: "$absoluteTotalWithTaxes" }
        }
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          revenue: "$totalRevenue"
        }
      }
    ])

    console.log("monthlyRevenue---->", weeklyRevenue)

    const dayMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat"
    }

    const fullWeek = [1, 2, 3, 4, 5, 6, 7]
    const revenueDatas = fullWeek.map(dayNum => {
      const found = weeklyRevenue.find(item => item.day === dayNum);
      return {
        name: dayMap[dayNum],
        revenue: found ? found.revenue : 0
      }
    })

    console.log("weeklyRevenue with weeks---->", revenueDatas)

    res.status(200).json({revenueDatas});
  }
  catch(error){
    console.error("Error fetching weekly revenue:", error.message)
    next(error)
  }
}


const getHourlySalesOfDay = async (req, res, next)=> {
  try {
    console.log("Inside getHourlySalesOfDay")
      
    const {date} = req.params
    console.log("date--->", date)

    if (!date) {
      return next(errorHandler(400, "Please provide a date in YYYY-MM-DD format.!"))
    }

    const start = new Date(date)
    const end = new Date(date)
    end.setDate(end.getDate() + 1)

    const salesData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lt: end },
          orderStatus: 'delivered'
        }
      },
      {
        $project: {
          hour: { $hour: '$orderDate' },
          total: '$absoluteTotalWithTaxes'
        }
      },
      {
        $group: {
          _id: '$hour',
          totalSales: { $sum: '$total' }
        }
      },
      {
        $project: {
          _id: 0,
          hour: '$_id',
          totalSales: 1
        }
      }
    ]);

    const daySalesDatas = Array.from({ length: 24 }, (_, i) => {
      const found = salesData.find(s => s.hour === i);
      return {
        hour: `${i.toString().padStart(2, '0')}:00`,
        totalSales: found ? found.totalSales : 0
      }
    })
    console.log("daySalesDatas--->", daySalesDatas)

    res.status(200).json({daySalesDatas})
  }
  catch(error){
    console.error('Hourly sales error:', error.message)
    next(error)
  }
}


const getRevenueByMainCategory = async (req, res, next) => {
  try {
    console.log("Inside getRevenueByMainCategory")

    const allMainCategories = await Category.find({parentCategory: null}, {name: 1}).lean()

    const revenueData = await Order.aggregate([
      {
        $match: {
          orderStatus: 'delivered'
        }
      },
      {
        $unwind: '$products'
      },
      {
        $unwind: '$products.category'
      },
      {
        $group: {
          _id: '$products.category',
          revenue: { $sum: '$products.total' }
        }
      },
    ]);
    console.log("revenueData-->", JSON.stringify(revenueData))

    const revenueMap = new Map()
    revenueData.forEach(item=> {
      revenueMap.set(item._id, item.revenue)
    })
    console.log("revenueMap-->", JSON.stringify(revenueMap))

    const categoryDatas = allMainCategories.map(cat => ({
      name: cat.name,
      revenue: revenueMap.get(cat.name) || 0
    }))

    console.log("categoryDatas--->", categoryDatas)

    res.status(200).json({categoryDatas})
  }
  catch(error){
    console.error('Error fetching revenue by category:', error.message)
    next(error)
  }
}








module.exports = {getAnnualRevenueStats, getAverageOrderTotal, getTotalOrdersCount, getMonthlyRevenue, getWeeklyRevenue,
   getHourlySalesOfDay, getRevenueByMainCategory}
