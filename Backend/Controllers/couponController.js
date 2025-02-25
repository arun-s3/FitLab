const Coupon = require('../Models/couponModel')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
const Category = require('../Models/categoryModel')
const User = require('../Models/userModel')
const {errorHandler} = require('../Utils/errorHandler') 



const createCoupon = async (req, res, next)=> {
    try {
      console.log("Inside createCoupon of couponController")
  
      const {
        code,
        description,
        discountType,
        discountValue,
        minimumOrderValue,
        usageLimit,
        usageLimitPerCustomer,
        applicableType,
        applicableCategories,
        applicableProducts,
        customerSpecific,
        assignedCustomers,
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
      // if(discountType === 'fixed' && !minimumOrderValue){
      //   return next(errorHandler(400, "Minimum order value is missing!"))
      // }
  
      if (new Date(endDate) <= new Date(startDate)) {
        return next(errorHandler(400, "Expiry date must be after start date!"))
      }
  
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() })
      if (existingCoupon) {
        return next(errorHandler(400, "Coupon code already exists!"))
      }

      let categoryIds = []
      if (Array.isArray(applicableCategories) && applicableCategories.length > 0) {
        const categories = await Category.find({ name: { $in: applicableCategories } }, "_id")
        categoryIds = categories.map((cat) => cat._id);
      }

      let productIds = []
      if (Array.isArray(applicableProducts) && applicableProducts.length > 0) {
        const products = await Product.find({ title: { $in: applicableProducts } }, "_id")
        productIds = products.map((prod) => prod._id);
      }

      let userIds = []
      if (Array.isArray(assignedCustomers) && assignedCustomers.length > 0) {
        const users = await User.find({ username: { $in: assignedCustomers } }, "_id")
        userIds = users.map((user) => user._id);
      }

      let oneTimeUse = true
      if(usageLimitPerCustomer &&  usageLimitPerCustomer > 0){
        oneTimeUse = false
      }
  
      const newCoupon = new Coupon({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minimumOrderValue,
        usageLimit,
        usageLimitPerCustomer,
        oneTimeUse,
        applicableType,
        applicableCategories: categoryIds,
        applicableProducts: productIds,
        customerSpecific,
        assignedCustomers: customerSpecific ? userIds : [],
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


const updateCoupon = async (req, res, next)=> {
  try {
    console.log("Inside updateCoupon of couponController")

    const {couponId} = req.params
    const couponDetails = req.body.couponDetails
    console.log(`couponId---->${couponId}, couponDetails----->${JSON.stringify(couponDetails)}`)

    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderValue,
      usageLimit,
      usageLimitPerCustomer,
      oneTimeUse,
      applicableType,
      applicableCategories,
      applicableProducts,
      customerSpecific,
      assignedCustomers,
      startDate,
      endDate,
    } = couponDetails

    if (!code || !discountType || !startDate || !endDate) {
      return next(errorHandler(400, "Required fields are missing!"))
    }
    if (discountType === "percentage" && !discountValue) {
      return next(errorHandler(400, "Discount value is missing!"))
    }
    // if (discountType === "fixed" && !minimumOrderValue) {
    //   return next(errorHandler(400, "Minimum order value is missing!"))
    // }
    if (new Date(endDate) <= new Date(startDate)) {
      return next(errorHandler(400, "Expiry date must be after start date!"))
    }

    const existingCoupon = await Coupon.findById(couponId)
    if (!existingCoupon){
      return next(errorHandler(404, "Coupon not found!"));
    }

    const duplicateCoupon = await Coupon.findOne({ code: code.toUpperCase(), _id: { $ne: couponId } })
    if (duplicateCoupon) {
      return next(errorHandler(400, "Coupon code already exists!"));
    }

    const categoryIds = applicableCategories?.length
      ? await Category.find({ name: { $in: applicableCategories } }, "_id") : []

    const productIds = applicableProducts?.length
      ? await Product.find({ title: { $in: applicableProducts } }, "_id") : []

    const userIds = assignedCustomers?.length
      ? await User.find({ username: { $in: assignedCustomers } }, "_id"): [];

    let newOneTimeUse = oneTimeUse
    if(usageLimitPerCustomer &&  usageLimitPerCustomer > 0){
      newOneTimeUse = false
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minimumOrderValue,
        usageLimit,
        usageLimitPerCustomer,
        oneTimeUse: newOneTimeUse,
        applicableType,
        applicableCategories: categoryIds,
        applicableProducts: productIds,
        customerSpecific,
        assignedCustomers: customerSpecific ? userIds : [],
        startDate,
        endDate,
        status: "active"
      },
      { new: true}
    )

    return res.status(200).json({ success: true, message: "Coupon updated successfully!", coupon: updatedCoupon });

  }
  catch(error){
    console.error("Error updating coupon:", error.message)
    next(error)
  }
}


// const getAllCoupons = async (req, res, next)=> {
//   try {
//     console.log("Inside getAllCoupons of couponController")
    
//     const { page = 1, limit = 6 } = req.body.queryOptions || {}
//     const skip = (page - 1) * limit

//     const coupons = await Coupon.find().skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 })
//                         .populate("applicableProducts", "title price")
//                         .populate("applicableCategories", "name") 
//                         .populate("assignedCustomers", "username email")
//     const totalCoupons = await Coupon.countDocuments()

//     res.status(200).json({ success: true, coupons, totalCoupons })
//   }
//   catch (error){
//     console.error("Error listing coupon:", error.message)
//     next(error)
//   }
// }

const getAllCoupons = async (req, res, next) => {
  try {
    console.log("Inside getAllCoupons of couponController")

    const { queryOptions = {} } = req.body
    const { page = 1, limit = 6, startDate, endDate, sort = -1, sortBy = "createdAt", searchData } = queryOptions
    const skip = (page - 1) * limit
    console.log("queryOptions--->", JSON.stringify(queryOptions))

    let filterConditions = {}
    if (startDate && endDate) {
      filterConditions.startDate = { $gte: new Date(startDate) }
      filterConditions.endDate = { $lte: new Date(endDate) }
    }

    if (searchData) {
      filterConditions.code = { $regex: searchData, $options: "i" };
    }

    let sortOptions = {};
    if (["code", "startDate", "endDate", "usageLimit"].includes(sortBy)){
      sortOptions[sortBy] = sort
    } else {
      sortOptions.createdAt = sort
    }

    const coupons = await Coupon.find(filterConditions)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOptions)
      .populate("applicableProducts", "title price")
      .populate("applicableCategories", "name")
      .populate("assignedCustomers", "username email")

    const totalCoupons = await Coupon.countDocuments(filterConditions)

    res.status(200).json({ success: true, coupons, totalCoupons })
  }
  catch(error){
    console.error("Error listing coupons:", error.message)
    next(error)
  }
}


const deleteCoupon = async (req, res, next)=> {
  try {
    console.log("Inside deleteCoupon of couponController")
    const { couponId } = req.params
    console.log("couponId---->", couponId)

    if (!couponId) {
      return next(errorHandler(400, "Coupon ID is required!"))
    }

    const deletedCoupon = await Coupon.findByIdAndDelete(couponId)

    if (!deletedCoupon){
      return next(errorHandler(404, "Coupon not found!"))
    }

    return res.status(200).json({ message: "Coupon deleted successfully!", deletedCoupon})
  }
  catch(error) {
    console.error("Error deleting coupon:", error.message)
    next(error)
  }
}


const searchCoupons = async (req, res, next)=> {
  try {
    console.log("Inside searchCoupons of couponController");
    const {query} = req.query
    if (!query){
      return next(errorHandler(400, "Search query is required!"));
    }

    const coupons = await Coupon.find( { code: { $regex: query, $options: "i" } }, "code discountType status" )

    if (!coupons.length) {
      return res.status(404).json({ message: "No matching coupons found!" })
    }

    return res.status(200).json({ coupons })
  }
  catch(error){
    console.error("Error searching for coupons:", error.message)
    next(error)
  }
}







module.exports = {createCoupon, updateCoupon, getAllCoupons, deleteCoupon, searchCoupons }