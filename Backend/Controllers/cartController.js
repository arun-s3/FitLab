const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
const {errorHandler} = require('../Utils/errorHandler') 


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

    let cart = await Cart.findOne({userId})
    if (!cart) {
      console.log("Creating new cart...")
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            title: product.title,
            thumbnail: product.thumbnail.url,
            quantity,
            price: product.price,
            total: productTotal,
          },
        ],
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
        cart.products.push({productId, title: product.title, thumbnail: product.thumbnail.url, quantity, price: product.price, total: productTotal})
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


module.exports = {addToCart, removeFromCart}
