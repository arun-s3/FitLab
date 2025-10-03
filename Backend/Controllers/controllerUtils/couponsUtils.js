const mongoose = require("mongoose")
const Cart = require("../../Models/cartModel")
const Order = require("../../Models/orderModel")
const Coupon = require("../../Models/couponModel")
const {errorHandler} = require("../../Utils/errorHandler")



const recalculateAndValidateCoupon = async(req, res, next, userId, cart, coupon, absoluteTotal, deliveryCharge, gstCharge, fetchErrors = false)=> {
  try{
      console.log("Inside recalculateAndValidateCoupon--")
      console.log("coupon inside recalculateAndValidateCoupon-->", coupon)
      console.log(`${typeof absoluteTotal}....${typeof deliveryCharge}.....${typeof deliveryCharge}`)

      let sendResponse = '';
  
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
  
      let discountAmount = 0;
  
      // for (const item of cart.products){
      //     orderTotal += item.quantity * item.price
      // }
      if (absoluteTotal < coupon.minimumOrderValue) {
        errorHandler(400, `Your order must be at least ₹ ${coupon.minimumOrderValue} to use this coupon.`)
      }
  
      let isCouponApplicable = false
      console.log(" cart.products now just before coupon Application--->", JSON.stringify(cart.products))
      for (const item of cart.products){
          console.log("Checking coupon applicability in this product--->", item.productId.title)
          console.log(`Product categories--> ${JSON.stringify(item.productId.category)}`)
          console.log(`CouponApplicableCategories---> ${JSON.stringify(coupon.applicableCategories.map(cat=> cat.name))}`)
          const product = item.productId
          if(coupon.applicableType === "allProducts" ||
              (coupon.applicableType === "products" && coupon.applicableProducts.includes(product._id)) ||
              (coupon.applicableType === "categories" && 
                product.category.some(catName => coupon.applicableCategories.some(cat=> cat.name === catName)))
            ){
              isCouponApplicable = true
              break;
          }
      }
  
      if (!isCouponApplicable) {
        if(fetchErrors) return next(errorHandler(400, "Coupon is not applicable to selected products."))
        sendResponse = "Coupon is not applicable to the selected products. "
      }
  
      if(isCouponApplicable){
          if (coupon.discountType === "percentage") {
            discountAmount = Math.min(absoluteTotal * (coupon.discountValue / 100), coupon.maxDiscount || absoluteTotal)
        } else if (coupon.discountType === "fixed") {
            discountAmount = Math.min(coupon.discountValue, absoluteTotal)
        } else if (coupon.discountType === "freeShipping") {
            deliveryCharge = 0
        } else if (coupon.discountType === "buyOneGetOne") {
            if(!cart?.offerApplied || (cart?.offerApplied && cart?.offerDiscountType !== "buyOneGetOne")){
              let eligibleProducts = []
              for (const item of cart.products) {
                  const product = item.productId
                  if (
                      coupon.applicableType === "allProducts" ||
                      (coupon.applicableType === "products" && coupon.applicableProducts.includes(product._id)) ||
                      (coupon.applicableType === "categories" && 
                        product.category.some(catName => coupon.applicableCategories.some(cat=> cat.name === catName)))
                  ) {
                      eligibleProducts.push(item)
                  }
              }
              if (eligibleProducts.length >= 2) {
                eligibleProducts.sort((a, b)=> a.price - b.price)
              
                let freeItemsCount = 0
                let totalBOGODiscount = 0
              
                for (let i = 1; i < eligibleProducts.length; i += 2) {
                    totalBOGODiscount += eligibleProducts[i].price
                    freeItemsCount++
                }
                discountAmount = totalBOGODiscount;
              }else {
                if(fetchErrors) errorHandler(400, "BOGO coupon requires at least two eligible products.")
                sendResponse = "BOGO coupon requires at least two eligible products."
              }
            }
        }
      }
  
      const finalTotal = (absoluteTotal - discountAmount) + gstCharge + deliveryCharge
  
      console.log(`finalTotal-----${finalTotal},discountAmount------> ${discountAmount}, deliveryCharge------>${deliveryCharge}`)
  
      return {absoluteTotalWithTaxes: finalTotal, couponDiscount: discountAmount, deliveryCharge, sendResponse}
  }
  catch(error){
    console.error("Error in recalculateAndValidateCoupon:", error.message)
    errorHandler(500, "Internal Server Error.")
  }
}



module.exports = {recalculateAndValidateCoupon}
