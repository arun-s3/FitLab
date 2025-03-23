const Cart = require('../Models/cartModel')
const Order = require('../Models/orderModel')
const Product = require('../Models/productModel')
const Category = require('../Models/categoryModel')
const Coupon = require('../Models/couponModel')

const {calculateCharges} = require('./controllerUtils/taxesUtils')
const {recalculateAndValidateCoupon} = require('./controllerUtils/couponsUtils')
const {calculateBestOffer} = require('./controllerUtils/offersAndDiscountsUtils')
const {errorHandler} = require('../Utils/errorHandler') 


const QTY_PER_PERSON = 5



const addToCart = async (req, res, next)=> {
  try {  
    console.log("Inside addToCart of cartController")
    const userId = req.user._id
    const { productId, quantity } = req.body

    console.log("req.user._id--->", userId)
    console.log("quantity--->", quantity)

    if (!productId || !quantity) {
      return next(errorHandler(400, "Invalid product or quantity!"))
    }

    const product = await Product.findById(productId)
    console.log("Product found-->", JSON.stringify(product))

    if (!product) {
      return next(errorHandler(404, "Product not found!"))
    }
    if (product.blocked) {
      return next(errorHandler(403, "This product is currently blocked and cannot be added to the cart."))
    }
    if (quantity > product.stock) {
      return next(errorHandler(400, `Insufficient stock! Only ${product.stock} items available.`))
    }
    if (quantity > QTY_PER_PERSON) {
      return next(errorHandler(400, `You cannot add more than ${QTY_PER_PERSON} items of this product to your cart.`))
    }
    
    const {offerDiscountType, bestDiscount, offerApplied} = await calculateBestOffer(userId, productId, quantity)
    const productTotal = (product.price - bestDiscount) * quantity
    console.log("productTotal now-->", productTotal)

    const productDetails = {
      productId,
      title: product.title,
      subtitle: product.subtitle,
      category: product.category,
      thumbnail: product.thumbnail.url,
      quantity,
      ...(isBOGO ? {extraQuantity: quantity} : {} ),
      price: product.price,
      offerApplied,
      offerDiscountType,
      offerDiscount: bestDiscount,
      total: productTotal,
    }

    let cart = await Cart.findOne({userId})
    if (!cart) {
      console.log("Creating new cart...")
      cart = new Cart({userId, products: [productDetails], absoluteTotal: productTotal})
    }else{
      console.log("Manipulating existing cart...")
      const existingProductIndex = cart.products.findIndex( (item)=> item.productId.toString() === productId )
      if (existingProductIndex >= 0) {
        console.log("Updating existing product in the cart...")
        const existingProduct = cart.products[existingProductIndex]
        console.log("existingProduct.quantity---->", existingProduct.quantity)

        if (existingProduct.quantity + quantity > product.stock) {
          return next(errorHandler(400, `Adding this quantity exceeds available stock! Only ${product.stock - existingProduct.quantity} 
              more items can be added.`))
        }

        if (existingProduct.quantity + quantity > QTY_PER_PERSON) {
          return next( errorHandler(400, `You cannot add more than ${QTY_PER_PERSON} items of this product to your cart.`))
        }

        existingProduct.quantity += quantity
        existingProduct.total += productTotal
        existingProduct.offerApplied = offerApplied
        existingProduct.offerDiscountType = offerDiscountType
        existingProduct.offerDiscount = bestDiscount
        if(isBOGO){
          existingProduct.extraQuantity = existingProduct.quantity += quantity
        } 
      }else{
        console.log("Creating new product in the cart...")
        cart.products.push(productDetails)
      }
      cart.absoluteTotal += productTotal
    }
    await cart.save();

    const {deliveryCharges, gstCharge, absoluteTotalWithTaxes} = calculateCharges(cart.absoluteTotal, cart.products)
    cart.gst = gstCharge
    // cart.deliveryCharge = deliveryCharges
    // cart.absoluteTotalWithTaxes = absoluteTotalWithTaxes

    if(cart.couponUsed){
      console.log("Inside if cart.couponUsed")
      const coupon = await Coupon.findOne({ _id: cart.couponUsed })
      console.log("couponUsed found inside cart-->", coupon)
      const {absoluteTotalWithTaxes, couponDiscount, deliveryCharge} =
         await recalculateAndValidateCoupon(req, res, next, userId, coupon, cart.absoluteTotal, parseInt(deliveryCharges), parseInt(gstCharge))

      console.log(`absoluteTotalWithTaxes-----${absoluteTotalWithTaxes},couponDiscount------> ${couponDiscount}, deliveryCharge------>${deliveryCharge}`)

      cart.couponDiscount = parseInt(couponDiscount)
      cart.deliveryCharge = parseInt(deliveryCharge)
      cart.absoluteTotalWithTaxes = parseInt(absoluteTotalWithTaxes)
    }else{
      console.log("Inside else cart.couponUsed")
      cart.deliveryCharge = parseInt(deliveryCharges)
      cart.absoluteTotalWithTaxes = parseInt(absoluteTotalWithTaxes)
    }

    await cart.save();

    res.status(200).json({ message: "Product added to cart successfully", cart })
  }catch (error){
    console.log("Error in cartController-addToCart-->" + error.message)
    next(error)
  }
}


const removeFromCart = async (req, res, next)=> {
  try {
    console.log("Inside removeFromCart of cartController")
    const userId = req.user._id
    const {productId} = req.body

    if (!productId) {
      return next(errorHandler(400, "Product ID is required"))
    }

    let cart = await Cart.findOne({ userId })
    if (!cart) {
      console.log("Cart not found for user")
      return next(errorHandler(404, "Cart not found"))
    }

    const productIndex = cart.products.findIndex((item)=> item.productId.toString() === productId)
    if (productIndex === -1) {
      console.log("Product not found in the cart")
      return next(errorHandler(404, "Product not found in the cart"))
    }

    const productToRemove = cart.products[productIndex]
    const amountToDeduct = productToRemove.total
    cart.products.splice(productIndex, 1)
    cart.absoluteTotal -= amountToDeduct

    // if (cart.products.length === 0) {
    //   cart.discount = 0 
    // }
    if(cart.products.length > 0){
      const {deliveryCharges, gstCharge, absoluteTotalWithTaxes} = calculateCharges(cart.absoluteTotal, cart.products)
      cart.gst = gstCharge
      // cart.deliveryCharge = deliveryCharges
      // cart.absoluteTotalWithTaxes = absoluteTotalWithTaxes

      if(cart.couponUsed){
        const coupon = await Coupon.findOne({ _id: cart.couponUsed })
        console.log("cart.gst--->", cart.gst)
        const {absoluteTotalWithTaxes, couponDiscount, deliveryCharge} =
          await recalculateAndValidateCoupon(req, res, next, userId, coupon, cart.absoluteTotal, parseInt(deliveryCharges), parseInt(gstCharge))
        console.log("cart.gst after recalculateAndValidateCoupon--->", cart.gst)


        cart.couponDiscount = parseInt(couponDiscount)
        cart.deliveryCharge = parseInt(deliveryCharge)
        cart.absoluteTotalWithTaxes = parseInt(absoluteTotalWithTaxes)
        console.log("cart.gst just before saving--->", cart.gst)
      }else{
        console.log("Inside else cart.couponUsed")
        cart.deliveryCharge = parseInt(deliveryCharges)
        cart.absoluteTotalWithTaxes = parseInt(absoluteTotalWithTaxes)
      }
    }else{
        cart.couponUsed = null
        cart.couponDiscount = 0
        cart.deliveryCharge = 0
        cart.absoluteTotalWithTaxes = 0
    }

    await cart.save();

    res.status(200).json({
      message: 'Product removed from cart successfully', cart, userId,
      absoluteTotal: cart.absoluteTotal,
      couponDiscount: cart.couponDiscount,
      deliveryCharge: cart.deliveryCharge,
      gst: cart.gst,
      absoluteTotalWithTaxes: cart.absoluteTotalWithTaxes
    })
  }
  catch (error){
    console.log("Error in cartController-removeFromCart-->", error.message)
    next(error)
  }
}

const getTheCart = async (req, res, next) => {
  try {
    const userId = req.user._id
    console.log("Fetching cart for user:", userId)

    const cart = await Cart.findOne({ userId }).populate("couponUsed")
    if (!cart || cart.products.length === 0) {
      return res.status(200).json({message: 'Your cart is empty', cart: []})
    }
    return res.status(200).json({ message: 'Products fetched successfully!', cart})
  } 
  catch (error){
    console.error('Error fetching products from cart:', error.message);
    next(error)
  }
}


const applyCoupon = async (req, res, next)=> {
  try {
      console.log("Inside applyCoupon controller")
      const userId = req.user._id
      const {couponCode} = req.body

      if (!couponCode){
          return next(errorHandler(400, "Coupon code is required."))
      }

      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() })
      const cart = await Cart.findOne({ userId }).populate("products.productId")

      if (!coupon || coupon.status !== "active"){
          return next(errorHandler(400, "Invalid or expired coupon code."))
      }
      const now = new Date()
      if (now < coupon.startDate || now > coupon.endDate){
          coupon.status = "expired"
          await coupon.save()
          return next(errorHandler(400, "Coupon is expired or not yet active."))
      }

      const userUsage = coupon.usedBy.find((usage) => usage.userId.toString() === userId)
      if (userUsage && userUsage.count >= coupon.usageLimitPerCustomer) {
        return next(errorHandler(400, "You have already used this coupon the maximum number of times."))
      }
      if (coupon.oneTimeUse && userUsage) {
        return next(errorHandler(400, "This coupon can only be used once per user."))
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit){
          coupon.status = "usedUp"
          await coupon.save()
          return next(errorHandler(400, "Coupon usage limit reached."))
      }

      if(coupon.customerSpecific && !coupon.assignedCustomers.some(user=> user.equals(new mongoose.Types.ObjectId(userId)))){
        return next(errorHandler(400, "This is a restricted users' coupon and cannot be applied to your account!"))
      }

      const userOrderCount = await Order.countDocuments({ userId, couponUsed: coupon._id })
      if (coupon.usageLimitPerCustomer !== null && userOrderCount >= coupon.usageLimitPerCustomer){
          return next(errorHandler(400, "You have already used this coupon the maximum allowed times."))
      }

      if (!cart || cart.products.length === 0) {
        console.log("Creating new cart...")
        cart = new Cart({userId, couponUsed: coupon._id})
        return res.status(200).json({ message: "Coupon applied successfully!" })
      }

      let orderTotal = 0
      let discountAmount = 0
      let deliveryCharge = cart.deliveryCharge

      for (const item of cart.products){
          orderTotal += item.quantity * item.price
      }
      if (orderTotal < coupon.minimumOrderValue) {
          return next(errorHandler(400, `Your order must be at least ₹ ${coupon.minimumOrderValue} to use this coupon.`))
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
          return next(errorHandler(400, "Coupon is not applicable to selected products."))
      }

      if (coupon.discountType === "percentage") {
          discountAmount = Math.min(orderTotal * (coupon.discountValue / 100), coupon.maxDiscount || orderTotal)
      } else if (coupon.discountType === "fixed") {
          discountAmount = Math.min(coupon.discountValue, orderTotal)
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
              return next(errorHandler(400, "Buy One Get One coupon requires at least two eligible products!"))
          }
      }

      const finalTotal = (orderTotal - discountAmount) + cart.gst + deliveryCharge

      cart.absoluteTotalWithTaxes = finalTotal
      cart.deliveryCharge = deliveryCharge
      cart.couponDiscount = discountAmount
      cart.couponUsed = coupon._id

      await cart.save();

      res.status(200).json({
          message: "Coupon applied successfully!",
          couponDiscount: discountAmount,
          newTotal: finalTotal,
          deliveryCharge,
      });

  } 
  catch (error){
      console.log("Error in applyCouponController:", error.message)
      next(error)
  }
}


const removeCoupon = async (req, res, next)=> {
  try {
    console.log("Inside removeCoupon of cartController")

    const userId = req.user._id

    let cart = await Cart.findOne({ userId })

    if (!cart){
      console.log("Cart not found for user")
      return next(errorHandler(404, "Cart not found!"))
    }
    if (!cart.couponUsed){
      console.log("No coupon applied to the cart")
      return next(errorHandler(400, "No coupon applied to the cart!"))
    }

    cart.couponUsed = null
    cart.couponDiscount = 0

    const { deliveryCharges, gstCharge, absoluteTotalWithTaxes } = calculateCharges(cart.absoluteTotal, cart.products);

    cart.gst = gstCharge
    cart.deliveryCharge = parseInt(deliveryCharges)
    cart.absoluteTotalWithTaxes = parseInt(absoluteTotalWithTaxes)

    await cart.save()

    res.status(200).json({
      message: "Coupon removed successfully",
      cart,
      couponDiscount: cart.couponDiscount,
      deliveryCharge: cart.deliveryCharge,
      absoluteTotalWithTaxes: cart.absoluteTotalWithTaxes
    })
  }
  catch (error){
    console.log("Error in cartController-removeCoupon -->", error.message)
    next(error)
  }
}



module.exports = {addToCart, removeFromCart, getTheCart, calculateCharges, applyCoupon, removeCoupon}
