const mongoose = require("mongoose")
const Cart = require("../../Models/cartModel")
const Order = require("../../Models/orderModel")
const Coupon = require("../../Models/couponModel")
const {errorHandler} = require("../../Utils/errorHandler")


const GST_GYM_PERCENTAGE = 0.18
const GST_SUPPLEMENTS_PERCENTAGE = 0.12
const FREE_DELIVERY_THRESHOLD = 20000
const STANDARD_DELIVERY_CHARGE = 500


const calculateCharges = (absoluteTotal, products)=> {

      console.log("Inside calculateCharges of cartController")
      // const {absoluteTotal, products} = req.body
      console.log("absoluteTotal inside calculateCharges of cartController--->", absoluteTotal)
  
      if (!absoluteTotal || absoluteTotal <= 0) {
        errorHandler(400, "Invalid total amount provided")
      }
      
      let totalGST = 0
      let actualDeliveryCharge = 0
  
      products.forEach((product) => {
        let gstRate = GST_GYM_PERCENTAGE
        if (product.category === "supplements") gstRate = GST_SUPPLEMENTS_PERCENTAGE
        const productGST = (product.price - product.offerDiscount) * product.quantity * gstRate 
        totalGST += productGST
        if(product?.weight && product.offerDiscountType !== 'freeShipping'){
          actualDeliveryCharge += product.weight > 15 ? 200 : 50
        }
        console.log(`product--->${product.title} and totalGST---->${totalGST}`)
      })
  
      let deliveryCharges = absoluteTotal >= FREE_DELIVERY_THRESHOLD ? 0 : Math.max(actualDeliveryCharge, STANDARD_DELIVERY_CHARGE)
  
      const absoluteTotalWithTaxes = absoluteTotal + deliveryCharges + totalGST;
  
      console.log(`deliveryCharges--${deliveryCharges}, gst--${totalGST}, absoluteTotalWithTaxes--${absoluteTotalWithTaxes}`)
  
      return {
          deliveryCharges: deliveryCharges?.toFixed(2),
          gstCharge: totalGST?.toFixed(2),
          absoluteTotalWithTaxes: absoluteTotalWithTaxes?.toFixed(2),
      }
}

  

module.exports = {calculateCharges}
