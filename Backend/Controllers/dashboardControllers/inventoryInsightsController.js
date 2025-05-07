const Product = require('../../Models/productModel')
const Order = require('../../Models/orderModel')

const {errorHandler} = require('../../Utils/errorHandler') 


const getProductStockInsights = async (req, res, next)=> {
  try {
    console.log("Inside getProductStockSummary")

    const [totalProducts, lowStockProducts, outOfStockProducts] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),  
      Product.countDocuments({ stock: 0 })
    ])
    console.log(`totalProducts----> ${totalProducts} lowStockProducts----> ${lowStockProducts} outOfStockProducts--${outOfStockProducts}`)

    res.status(200).json({
      totalProducts,
      lowStockProducts,
      outOfStockProducts
    });
  }
  catch (error){
    console.error("Error fetching stock summary:", error.message)
    next(error)
  }
}



module.exports = {getProductStockInsights}
