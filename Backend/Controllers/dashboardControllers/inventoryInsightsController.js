const Product = require('../../Models/productModel')
const Category = require('../../Models/categoryModel')

const {errorHandler} = require('../../Utils/errorHandler') 

const LOW_STOCK_THRESHOLD = 5;


const getProductStockInsights = async (req, res, next)=> {
  try {
    console.log("Inside getProductStockSummary")

    const [totalProducts, lowStockProducts, outOfStockProducts] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD } }),  
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


const getLowStockProducts = async (req, res, next) => {
    try {
        console.log("Inside getLowStockProducts")

        const mainProducts = await Product.find({
            isBlocked: false,
            variantOf: { $in: [null, undefined] },
        })
            .populate({
                path: "variants",
                select: "weight size motorPower color stock price",
            })
            .lean()

        const formattedLowStock = mainProducts
            .map((main) => {
                const variants = main.variants || []
                const variantKey = main.variantType

                const prices = [main.price, ...variants.map((v) => v.price)]
                const stocks = [main.stock, ...variants.map((v) => v.stock)]

                const totalStock = stocks.reduce((sum, s) => sum + (s || 0), 0)

                if (totalStock === 0 || totalStock > LOW_STOCK_THRESHOLD) {
                    return null
                }

                const variantValues = variantKey
                    ? [main[variantKey], ...variants.map((v) => v[variantKey])].filter(Boolean)
                    : []

                const minPrice = Math.min(...prices)
                const maxPrice = Math.max(...prices)

                return {
                    _id: main._id,
                    thumbnail: main.thumbnail?.url || "",
                    name: main.title,
                    subtitle: main.subtitle,
                    totalStock,
                    price: minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`,
                    ...(variantKey ? { [`${variantKey}s`]: variantValues } : {}),
                }
            })
            .filter(Boolean) 

        console.log("Low stock products ---->", formattedLowStock)

        res.status(200).json({ lowStockDatas: formattedLowStock })
    } catch (error) {
        console.error("Error fetching low stock products:", error.message)
        next(error)
    }
}



const getCategoryStockDatas = async (req, res, next)=> {
  try {
    console.log("Inside getStockStatsPerMainCategory")

    const mainCategories = await Category.find({parentCategory: null})

    const results = []

    for (const mainCategory of mainCategories){
      const categoryName = mainCategory.name

      const products = await Product.find({category: categoryName})

      let inStock = 0;
      let lowStock = 0;
      let outOfStock = 0;

      products.forEach((product)=> {
        if (product.stock === 0){
          outOfStock++
        } else if (product.stock < 10){
          lowStock++
        } else{
          inStock++
        }
      })

      results.push({
        name: categoryName,
        inStock,
        lowStock,
        outOfStock,
      })
    }

    return res.status(200).json({categoryStockDatas: results});
  }
  catch(error){
    console.error("Error fetching stock stats:", error.message)
    next(error)
  }
}


module.exports = {getProductStockInsights, getLowStockProducts, getCategoryStockDatas}
