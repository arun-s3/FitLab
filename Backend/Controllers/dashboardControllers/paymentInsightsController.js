const Offer = require('../../Models/offerModel')
const Order = require('../../Models/orderModel')
const Product = require('../../Models/productModel')

const {errorHandler} = require('../../Utils/errorHandler') 



const getWalletAndRefundStats = async (req, res, next)=> {
  try {
    console.log("Inside getWalletAndRefundStats")
    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)

    const walletPaymentsAgg = await Order.aggregate([
      {
        $match: {
          "paymentDetails.paymentMethod": "wallet",
          "paymentDetails.paymentStatus": "completed"
        }
      },
      {
        $group: {
          _id: null,
          totalWalletPayments: { $sum: "$absoluteTotalWithTaxes" }
        }
      }
    ])

    const totalWalletPayments = walletPaymentsAgg[0]?.totalWalletPayments || 0

    const refundTodayAgg = await Order.aggregate([
      {
        $match: {
          orderStatus: "refunded",
          updatedAt: { $gte: startOfToday }
        }
      },
      {
        $group: {
          _id: null,
          refundToday: { $sum: "$absoluteTotalWithTaxes" }
        }
      }
    ])

    const refundToday = refundTodayAgg[0]?.refundToday || 0;

    const refundYesterdayAgg = await Order.aggregate([
      {
        $match: {
          orderStatus: "refunded",
          updatedAt: { $gte: startOfYesterday, $lt: startOfToday }
        }
      },
      {
        $group: {
          _id: null,
          refundYesterday: { $sum: "$absoluteTotalWithTaxes" }
        }
      }
    ])

    const refundYesterday = refundYesterdayAgg[0]?.refundYesterday || 0

    const totalRefundAgg = await Order.aggregate([
      {
        $match: {
          orderStatus: "refunded"
        }
      },
      {
        $group: {
          _id: null,
          totalRefund: { $sum: "$absoluteTotalWithTaxes" }
        }
      }
    ])

    const totalRefund = totalRefundAgg[0]?.totalRefund || 0;

    const totalPaidOrdersAgg = await Order.aggregate([
      {
        $match: {
          "paymentDetails.paymentStatus": "completed"
        }
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: "$absoluteTotalWithTaxes" }
        }
      }
    ])

    const totalPaid = totalPaidOrdersAgg[0]?.totalPaid || 0
    const refundRate = totalPaid ? (totalRefund / totalPaid) * 100 : 0

    let refundChangePercent = 0
    if (refundYesterday > 0) {
      refundChangePercent = ((refundToday - refundYesterday) / refundYesterday) * 100
    } else if (refundToday > 0) {
      refundChangePercent = 100
    }

    console.log(`totalWalletPayments---> ${totalWalletPayments}, refundChangePercent---> ${refundChangePercent}, refundChangePercent---> ${refundChangePercent}`)

    return res.status(200).json({
      totalWalletPayments,
      totalRefund,
      refundToday,
      refundYesterday,
      refundChangePercent: refundChangePercent.toFixed(2),
      refundRate: refundRate.toFixed(2)
    });
  }
  catch(error){
    console.error("Error in getWalletAndRefundStats:", error.message)
    next(error)
  }
}


const getPaymentMethodStats = async (req, res, next)=> {
  try {
    console.log("Inside getPaymentMethodStats")
    const result = await Order.aggregate([
      {
        $match: {
          'paymentDetails.paymentStatus': 'completed' 
        }
      },
      {
        $group: {
          _id: '$paymentDetails.paymentMethod',
          totalAmount: { $sum: '$absoluteTotalWithTaxes' }
        }
      }
    ])

    const methodColors = {
      stripe: '#9f2af0',
      paypal: '#dab3f6',
      razorpay: '#d7f148',
      wallet: '#f1c40f',
      cashOnDelivery: '#7d7c8c'
    }

    const formatName = (method) => {
        switch (method) {
          case 'stripe': return 'Stripe'
          case 'paypal': return 'PayPal'
          case 'razorpay': return 'Razorpay'
          case 'wallet': return 'Wallet'
          case 'cashOnDelivery': return 'Cash On Delivery'
          default: return method
        }
    }

    const formattedData = result.map(item => ({
      name: formatName(item._id),
      value: item.totalAmount,
      color: methodColors[item._id] || '#ccc'
    }))
    console.log("paymentMethodDatas---->", formattedData)

    res.status(200).json({paymentMethodDatas: formattedData});
  }
  catch(error){
    console.error('Error in getPaymentMethodStats:', error.message)
    next(error)
  }
}


const getMonthlyRefundRequests = async (req, res, next) => {
  try {
    console.log("Inside getMonthlyRefundRequests")
    const currentYear = new Date().getFullYear();

    const pipeline = [
      {
        $match: {
          $or: [
            { orderStatus: "refunded" },
            { "products.productStatus": "refunded" }
          ],
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59Z`)
          }
        }
      },
      { $unwind: "$products" },
      {
        $match: {
          "products.productStatus": "refunded"
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          requests: { $sum: 1 },
          amount: { $sum: "$products.total" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          requests: 1,
          amount: 1
        }
      }
    ];

    const results = await Order.aggregate(pipeline)

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const fullYearRefundedData = Array.from({ length: 12 }, (_, i) => {
      const found = results.find(r => r.month === i + 1)
      return {
        name: monthNames[i],
        requests: found ? found.requests : 0,
        amount: found ? found.amount : 0
      }
    })

    res.status(200).json({refundRequestDatas: fullYearRefundedData});
  }
  catch(error){
    console.error("Error fetching monthly refund requests:", error.message)
    next(error)
  }
}



module.exports = {getWalletAndRefundStats, getPaymentMethodStats, getMonthlyRefundRequests}
