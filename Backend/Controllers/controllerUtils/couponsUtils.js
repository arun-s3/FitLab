const mongoose = require("mongoose")
const Cart = require("../../Models/cartModel")
const Order = require("../../Models/orderModel")
const Coupon = require("../../Models/couponModel")
const {errorHandler} = require("../../Utils/errorHandler")



const recalculateAndValidateCoupon = async(req, res, next, userId, coupon, absoluteTotal, deliveryCharge, gstCharge)=> {
  try{
    console.log("Inside recalculateAndValidateCoupon--")
      console.log("coupon inside recalculateAndValidateCoupon-->", coupon)
      console.log(`${typeof absoluteTotal}....${typeof deliveryCharge}.....${typeof deliveryCharge}`)
  
      if (!coupon || coupon.status !== "active"){
        errorHandler(400, "Invalid or expired coupon code.")
      }

      // const coupon = await Coupon.findOne({ _id: coupon._id })
      const now = new Date()
      if (now < coupon.startDate || now > coupon.endDate){
          coupon.status = "expired"
          await coupon.save()
          errorHandler(400, "Coupon is expired or not yet active.")
      }

      const userUsage = coupon.usedBy.find((usage) => usage.userId.toString() === userId)
      if (userUsage && userUsage.count >= coupon.usageLimitPerCustomer) {
      errorHandler(400, "You have already used this coupon the maximum number of times.")
      }
      if (coupon.oneTimeUse && userUsage) {
        errorHandler(400, "This coupon can only be used once per user.")
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit){
          coupon.status = "usedUp"
          await coupon.save()
          errorHandler(400, "Coupon usage limit reached.")
      }
  
      if(coupon.customerSpecific && !coupon.assignedCustomers.some(user=> user.equals(new mongoose.Types.ObjectId(userId)))){
        errorHandler(400, "This is a restricted users' coupon and cannot be applied to your account!")
      }
  
      const userOrderCount = await Order.countDocuments({ userId, couponUsed: coupon._id })
      if (coupon.usageLimitPerCustomer !== null && userOrderCount >= coupon.usageLimitPerCustomer){
          errorHandler(400, "You have already used this coupon the maximum allowed times.")
      }
  
      const cart = await Cart.findOne({ userId }).populate("products.productId")
      if (!cart || cart.products.length === 0) {
          errorHandler(400, "Your cart is empty!")
      }
  
      let discountAmount = 0;
  
      // for (const item of cart.products){
      //     orderTotal += item.quantity * item.price
      // }
      if (absoluteTotal < coupon.minimumOrderValue) {
        errorHandler(400, `Your order must be at least ₹ ${coupon.minimumOrderValue} to use this coupon.`)
      }
  
      let isCouponApplicable = false
      for (const item of cart.products){
          const product = item.productId
          if(coupon.applicableType === "allProducts" ||
              (coupon.applicableType === "products" && coupon.applicableProducts.includes(product._id)) ||
              (coupon.applicableType === "categories" && product.category.some(catId=> coupon.applicableCategories.includes(catId)))
            ){
              isCouponApplicable = true
              break;
          }
      }
  
      if (!isCouponApplicable) {
        errorHandler(400, "Coupon is not applicable to selected products.")
      }
  
      if (coupon.discountType === "percentage") {
          discountAmount = Math.min(absoluteTotal * (coupon.discountValue / 100), coupon.maxDiscount || absoluteTotal)
      } else if (coupon.discountType === "fixed") {
          discountAmount = Math.min(coupon.discountValue, absoluteTotal)
      } else if (coupon.discountType === "freeShipping") {
          deliveryCharge = 0
      } else if (coupon.discountType === "buyOneGetOne") {
          let eligibleProducts = []
          for (const item of cart.products) {
              const product = item.productId
              if (
                  coupon.applicableType === "allProducts" ||
                  (coupon.applicableType === "products" && coupon.applicableProducts.includes(product._id)) ||
                  (coupon.applicableType === "categories" && product.category.some(catId => coupon.applicableCategories.includes(catId)))
              ) {
                  eligibleProducts.push(item)
              }
          }
          if (eligibleProducts.length >= 2) {
            eligibleProducts.sort((a, b) => a.price - b.price)
          
            let freeItemsCount = 0
            let totalBOGODiscount = 0
          
            for (let i = 1; i < eligibleProducts.length; i += 2) {
                totalBOGODiscount += eligibleProducts[i].price
                freeItemsCount++
            }
            discountAmount = totalBOGODiscount;
          }else {
            errorHandler(400, "BOGO coupon requires at least two eligible products.")
          }
      }
  
      const finalTotal = (absoluteTotal - discountAmount) + gstCharge + deliveryCharge
  
      console.log(`finalTotal-----${finalTotal},discountAmount------> ${discountAmount}, deliveryCharge------>${deliveryCharge}`)
  
      return {absoluteTotalWithTaxes: finalTotal, couponDiscount: discountAmount, deliveryCharge}
  }
  catch(error){
    console.error("Error in recalculateAndValidateCoupon:", error.message)
    errorHandler(500, "Internal Server Error.")
  }
}



module.exports = {recalculateAndValidateCoupon}
