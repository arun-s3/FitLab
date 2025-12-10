const mongoose = require("mongoose")
const Product = require("../../Models/productModel")
const Category = require("../../Models/categoryModel")
const Cart = require("../../Models/cartModel")
const Order = require("../../Models/orderModel")
const Coupon = require("../../Models/couponModel")
const Offer = require("../../Models/offerModel")

const {errorHandler} = require("../../Utils/errorHandler")


const VIP_SPENDING_TRESHHOLD = 100000
const USER_INACTIVE_PERIOD = 6 * 30 * 24 * 60 * 60 * 1000


const findUserGroup = async(userId)=> {
    try{
        const lastOrder = await Order.findOne({ userId, 'paymentDetails.paymentStatus': 'completed'}).sort({ orderDate: -1 })
        console.log("lastOrder-->", lastOrder)
        let userType = !lastOrder || lastOrder == null
          ? 'newUsers' : (Date.now() - new Date(lastOrder.orderDate).getTime() > USER_INACTIVE_PERIOD) ? 'returningUsers' : 'all'
        console.log("userType inside findUserGroup-->", userType)

        const totalSpent = await Order.aggregate([
            { $match: { userId, 'paymentDetails.paymentStatus': 'completed' } },
            { $group: { _id: null, totalSpent: { $sum: "$absoluteTotalWithTaxes" } } }
        ])
            
        userType = !totalSpent.length ? userType : totalSpent[0].totalSpent >= VIP_SPENDING_TRESHHOLD ? 'VIP' : userType
      
        console.log("returning userType-->", userType)
        return userType
    }
    catch(error){
        console.error("Error in findUserGroup:", error.message)
        errorHandler(500, "Internal Server Error.")
    }
}


const calculateBestOffer = async (userId, productId, quantity)=> {
  try {
      console.log("Inside calculateBestOffer")
      console.log(`userId--->${userId}, productId--->${productId}, quantity---${quantity}`)

      // const cart = await Cart.findOne({ userId }).populate("products.productId")
      // if (!cart){
      //     errorHandler(404, "Cart not found!")
      // }
      const product = await Product.findById(productId)
      if (!product){
          errorHandler(404, "Product not found!")
      }

      const userType = await findUserGroup(userId)
      console.log("userType--->", userType)

      const orderValue = product.price * quantity

      const offers = await Offer.find({
        targetUserGroup: {$in: [userType, 'all']},
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
        status: "active",
        $or: [
          { minimumOrderValue: { $exists: false } }, 
          { minimumOrderValue: { $lte: orderValue } }, 
        ],
      });

      let discount = 0;
      let bestDiscount = 0;
      let offerDiscountType = null;
      let bestOffer = null;
      let isBOGO = false;
      let offerDetails = null;
    
      const calculateDiscount = (offer)=> {
        console.log("Inside calculateDiscount for offer--->", offer)
        if (offer.discountType === "percentage") {
          discount = (product.price * quantity * offer.discountValue) / 100
          if (offer.maxDiscount) {
            discount = Math.min(discount, offer.maxDiscount)
          }
        }
        else if (offer.discountType === "fixed") {
          discount = offer.discountValue
          if (offer.maxDiscount) {
            discount = Math.min(discount, offer.maxDiscount)
          }
        } 
        else if (offer.discountType === "buyOneGetOne") {
          isBOGO = true
        }
        if (discount > bestDiscount) {
          bestDiscount = discount
          offerDetails = offer
          bestOffer = offer._id
          offerDiscountType = offer.discountType
        }
      }
      
      const categoryIds = await Category.find({ name: {$all: product.category} }, {_id: 1})
      console.log("categoryIds--->", categoryIds)

      offers.forEach((offer)=> {
          if (offer.applicableType === 'categories' && categoryIds.some(id=> offer.applicableCategories.includes(id))) {
              calculateDiscount(offer)
          }
          if (offer.applicableType === 'products' && offer.applicableProducts.includes(productId.toString())){
            calculateDiscount(offer)
          }
          if (offer.applicableType === 'allProducts'){
            calculateDiscount(offer)
          }
      })

      const productDiscount = product.discountType === 'fixed' ? Math.min(product.discountValue, product.maxDiscount)
                              : Math.min(product.price * quantity * product.discountValue/100, product.maxDiscount)
      if (productDiscount > bestDiscount) {
        bestDiscount = productDiscount
        bestOffer = 'productDiscount'
      }
      // Check if product is already in the cart
      // let existingItem = cart.products.find(item => item.productId.toString() === productId)

      // if (existingItem) {
      //     existingItem.quantity += quantity
      //     if(isBOGO){
      //       existingItem.quantity += quantity
      //     }
      // } else {
      //     cart.items.push({ product: productId, quantity: quantity + extraQuantity });
      // }

      // // Apply the best discount
      // if (bestOffer && bestOffer.discountType !== "buyOneGetOne") {
      //     cart.totalPrice -= bestDiscount;
      // }

      // await cart.save();
      let offerOrProductDiscount = null
      if(bestOffer == null){
        offerOrProductDiscount = {offerOrProductDiscount: null}
      }
      else if(bestOffer === 'productDiscount'){
        offerOrProductDiscount = {offerOrProductDiscount: 'discount'}
        bestOffer = null
      }
      else{
        offerOrProductDiscount = {offerOrProductDiscount: 'offer'}
      }

      console.log(`offerApplied: bestOffer--->${bestOffer}..bestDiscount--->${bestDiscount}..offerDiscountType-->${offerDiscountType}...isBOGO-->${isBOGO}`)
      
      return { offerDiscountType, bestDiscount, offerApplied: bestOffer, offerDetails, isBOGO, ...offerOrProductDiscount }
 
  } catch (error) {
      console.error("Error in calculateBestOffer:", error.message)
      errorHandler(500, "Internal Server Error.")
  }
}


module.exports = {findUserGroup, calculateBestOffer}
