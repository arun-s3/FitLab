const Coupon = require('../Models/couponModel')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
const {errorHandler} = require('../Utils/errorHandler') 



const createCoupon = async (req, res, next)=> {
    try {
      console.log("Inside createCoupon of couponController")
  
      const {
        code,
        discountType,
        discountValue,
        minimumOrderValue,
        usageLimit,
        usageLimitPerCustomer,
        applicableCategories,
        applicableProducts,
        customerSpecific,
        assignedCustomers,
        oneTimeUse,
        startDate,
        endDate,
      } = req.body.couponDetails
      
      console.log(`code--->${code}, discountType--->${discountType}, startDate--->${startDate}, endDate--->${endDate}`)
      if (!code || !discountType || !startDate || !endDate) {
        return next(errorHandler(400, "Required fields are missing!"))
      }
      if(discountType === 'percentage' && !discountValue){
        return next(errorHandler(400, "Discount value is missing!"))
      }
      if(discountType === 'fixed' && !minimumOrderValue){
        return next(errorHandler(400, "Minimum order value is missing!"))
      }
  
      if (new Date(endDate) <= new Date(startDate)) {
        return next(errorHandler(400, "Expiry date must be after start date!"))
      }
  
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() })
      if (existingCoupon) {
        return next(errorHandler(400, "Coupon code already exists!"))
      }
  
      const newCoupon = new Coupon({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minimumOrderValue,
        usageLimit,
        usageLimitPerCustomer,
        applicableCategories,
        applicableProducts,
        customerSpecific,
        assignedCustomers: customerSpecific ? assignedCustomers : [],
        oneTimeUse,
        startDate,
        endDate,
        status: "active",
      });
  
      await newCoupon.save()
  
      return res.status(201).json({ success: true, message: "Coupon created successfully!", coupon: newCoupon })
    } 
    catch (error) {
      console.error("Error creating coupon:", error.message)
      next(error)
    }
}


const getAllCoupons = async (req, res, next)=> {
  try {
    console.log("Inside getAllCoupons of couponController")
    
    const { page = 1, limit = 6 } = req.body.queryOptions || {}
    const skip = (page - 1) * limit

    const coupons = await Coupon.find().skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 })
    const totalCoupons = await Coupon.countDocuments()

    res.status(200).json({ success: true, coupons, totalCoupons })
  }
  catch (error){
    console.error("Error listing coupon:", error.message)
    next(error)
  }
}




module.exports = {createCoupon, getAllCoupons }