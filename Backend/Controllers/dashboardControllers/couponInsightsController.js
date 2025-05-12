const Coupon = require('../../Models/couponModel')
const Order = require('../../Models/orderModel')

const {errorHandler} = require('../../Utils/errorHandler') 



const getCouponRevenueStats = async(req, res, next)=> {
  console.log("Inside getCouponRevenueStats")
  const now = new Date()

  const startOfToday = new Date(now.setHours(0, 0, 0, 0))
  const endOfToday = new Date(now.setHours(23, 59, 59, 999))

  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)
  const endOfYesterday = new Date(startOfYesterday)
  endOfYesterday.setHours(23, 59, 59, 999)

  const totalCouponRevenueData = await Order.aggregate([
    {
      $match: {
        couponUsed: { $ne: null },
        createdAt: { $lt: startOfToday } 
      }
    },
    {
      $group: {
        _id: null,
        totalDiscount: { $sum: "$couponDiscount" }
      }
    }
  ])
  console.log("totalCouponRevenueData--->", totalCouponRevenueData)

  const todayData = await Order.aggregate([
    {
      $match: {
        couponUsed: { $ne: null },
        createdAt: { $gte: startOfToday, $lte: endOfToday }
      }
    },
    {
      $group: {
        _id: null,
        totalDiscount: { $sum: "$couponDiscount" }
      }
    }
  ])
  console.log("todayData--->", todayData)

  const yesterdayData = await Order.aggregate([
    {
      $match: {
        couponUsed: { $ne: null },
        createdAt: { $gte: startOfYesterday, $lte: endOfYesterday }
      }
    },
    {
      $group: {
        _id: null,
        totalDiscount: { $sum: "$couponDiscount" }
      }
    }
  ])
  console.log("yesterdayData--->", yesterdayData)
  
  const totalCouponRevenue = totalCouponRevenueData[0]?.totalDiscount || 0
  const todayRevenue = todayData[0]?.totalDiscount || 0
  const yesterdayRevenue = yesterdayData[0]?.totalDiscount || 0

  let percentageChange = 0
  if (yesterdayRevenue !== 0) {
    percentageChange = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
  } else if (todayRevenue !== 0) {
    percentageChange = 100
  }
  console.log("percentageChange--->", percentageChange)

  res.status(200).json({
    totalCouponRevenue,
    todayRevenue,
    yesterdayRevenue,
    percentageChange: Math.round(percentageChange * 100) / 100
  });
}


const getCouponStats = async(req, res, next)=> {
  console.log("Inside getCouponStats")
  const now = new Date()

  const activeCouponCount = await Coupon.countDocuments({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
  console.log("activeCouponCount--->", activeCouponCount)

  const redemptions = await Order.aggregate([
    {
      $match: {
        couponUsed: { $ne: null },
        orderStatus: { $nin: ['cancelled', 'refunded', 'returning'] }
      }
    },
    {
      $group: {
        _id: "$couponUsed",
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "coupons",
        localField: "_id",
        foreignField: "_id",
        as: "coupon"
      }
    },
    {
      $unwind: "$coupon"
    },
    {
      $project: {
        couponId: "$coupon._id",
        code: "$coupon.code",
        count: 1
      }
    }
  ])
   console.log("activeCouponCount--->", activeCouponCount)
   console.log("redemptions--->", redemptions)

   const totalRedemptions = redemptions.reduce((counter, coupon)=> counter += coupon.count, 0)
   console.log("totalRedemptions---->", totalRedemptions)

  res.status(200).json({activeCouponCount, couponRedemptions: totalRedemptions});
}


const getCouponRedemptionDetails = async (req, res, next)=> {
  try {
    console.log("Inside getCouponRedemptionDetails")
    const couponRedemptionsDatas = await Order.aggregate([
      {
        $match: {
          couponUsed: { $ne: null },
          orderStatus: { $nin: ['cancelled', 'refunded', 'returning'] }
        }
      },
      {
        $group: {
          _id: "$couponUsed",
          redemptions: { $sum: 1 },
          revenue: { $sum: "$orderTotal" }  
        }
      },
      {
        $lookup: {
          from: "coupons",
          localField: "_id",
          foreignField: "_id",
          as: "coupon"
        }
      },
      {
        $unwind: "$coupon"
      },
      {
        $project: {
          name: "$coupon.code",
          redemptions: 1,
          revenue: 1,
          _id: 0
        }
      },
      {
        $sort: { redemptions: -1 }
      }
    ])
    console.log("couponRedemptionsDatas---->", couponRedemptionsDatas)

    res.status(200).json(couponRedemptionsDatas);
  }
  catch(error){
    console.error("Error in getCouponRedemptionDetails:", error.message)
    next(error)
  }
}


const getDiscountImpactDatas = async (req, res) => {
  try {
    console.log("Inside getDiscountImpactDatas")
    const revenue = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ["cancelled", "returning", "refunded"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          withDiscount: { $sum: "$absoluteTotalWithTaxes" },
          withoutDiscount: {
            $sum: {
              $add: ["$absoluteTotalWithTaxes", { $ifNull: ["$couponDiscount", 0] }],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ])

    // Convert numeric month to abbreviated name and format result
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const discountImpactDatas = revenue.map((item)=> ({
      name: monthNames[item._id.month - 1],
      withDiscount: item.withDiscount,
      withoutDiscount: item.withoutDiscount,
    }))
    console.log("discountImpactDatas---->", discountImpactDatas)

    res.status(200).json(discountImpactDatas);
  }
  catch(error){
    console.error("Error in getDiscountImpactDatas:", error.message)
    next(error)
  }
}





module.exports = {getCouponRevenueStats, getCouponStats, getCouponRedemptionDetails, getDiscountImpactDatas}
