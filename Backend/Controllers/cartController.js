const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
const {errorHandler} = require('../Utils/errorHandler') 

const GST_GYM_PERCENTAGE = 0.18
const GST_SUPPLEMENTS_PERCENTAGE = 0.12
const FREE_DELIVERY_THRESHOLD = 20000
const STANDARD_DELIVERY_CHARGE = 500

const calculateCharges = async (req, res, next) => {
  try {
    console.log("Inside calculateCharges of cartController")
    const {absoluteTotal, products} = req.body

    if (!absoluteTotal || absoluteTotal <= 0) {
      return next(errorHandler(400, "Invalid total amount provided"))
    }
    
    let totalGST = 0
    let actualDeliveryCharge = 0

    products.forEach((product) => {
      let gstRate = GST_GYM_PERCENTAGE
      if (product.category === "supplements") gstRate = GST_SUPPLEMENTS_PERCENTAGE
      const productGST = product.price * gstRate
      totalGST += productGST
      if(product?.weight){
        actualDeliveryCharge += product.weight > 15 ? 200 : 50
      }
      console.log(`product--->${product.title} and totalGST---->${totalGST}`)
    })

    let deliveryCharges = absoluteTotal >= FREE_DELIVERY_THRESHOLD ? 0 : Math.max(actualDeliveryCharge, STANDARD_DELIVERY_CHARGE)

    const absoluteTotalWithTaxes = absoluteTotal + deliveryCharges + totalGST;

    console.log(`deliveryCharges--${deliveryCharges}, gst--${totalGST}, absoluteTotalWithTaxes--${absoluteTotalWithTaxes}`)

    return res.status(200).json({
      message: "Charges calculated successfully.",
      rates: {
        absoluteTotal: absoluteTotal.toFixed(2),
        deliveryCharges: deliveryCharges.toFixed(2),
        gstCharge: totalGST.toFixed(2),
        absoluteTotalWithTaxes: absoluteTotalWithTaxes.toFixed(2),
      }
    })
  }catch(error){
    console.error("Error calculating charges:", error.message)
    next(error)
  }
}


const addToCart = async (req, res, next) => {
  try {
    console.log("Inside addToCart  of cartControler")
    const userId = req.user._id
    const {productId, quantity} = req.body
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
    const productTotal = product.price * quantity
    console.log("productTOtal now-->", productTotal)

    const productDetails = {
      productId,
      title: product.title,
      category: product.category,
      thumbnail: product.thumbnail.url,
      quantity,
      price: product.price,
      total: productTotal,
    }
    let cart = await Cart.findOne({userId})
    if (!cart) {
      console.log("Creating new cart...")
      cart = new Cart({
        userId,
        products: [productDetails],
        absoluteTotal: productTotal,
      })
    }else{
      console.log("Manipulating existing Cart...")
      const existingProductIndex = cart.products.findIndex( (item)=> item.productId.toString() === productId )
      if (existingProductIndex >= 0) {
        console.log("Updating existing product in the cart...")
        cart.products[existingProductIndex].quantity += quantity
        cart.products[existingProductIndex].total += productTotal
      } else {
        console.log("Creating new product in the cart...")
        cart.products.push(productDetails)
      }

      cart.absoluteTotal += productTotal
    }

    await cart.save();

    res.status(200).json({message: 'Product added to cart successfully', cart})
  } 
  catch (error){
    console.log("Error in cartController-addToCart-->"+error.message)
    next(error)
  }
}

const removeFromCart = async (req, res, next) => {
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

    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId)
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

    await cart.save();

    res.status(200).json({message: 'Product removed from cart successfully', cart})
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

    const cart = await Cart.findOne({ userId })
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


module.exports = {addToCart, removeFromCart, getTheCart, calculateCharges}