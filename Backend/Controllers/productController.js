const Product = require('../Models/productModel')
const cloudinary = require('../Utils/cloudinary')

const {Parser} = require("json2csv")
const PDFDocument = require("pdfkit")
require("pdfkit-table")

const jsPDF = require('jspdf').jsPDF
require('jspdf-autotable')

const path = require("path")


const {errorHandler} = require('../Utils/errorHandler')

const MAXPRICE = 500000


const packProductData = async (req, next)=>{
    try{
        console.log("req.body-->", JSON.stringify(req.body))
        console.log("req.files-->", JSON.stringify(req.files))
        console.log("Image path:", req.files['images'][0].path);
        console.log("Thumbnail path:", req.files['thumbnail'][0].path);
        
        const uploadedImages = await Promise.all(
            req.files['images'].map(async (image, index) => {
              const result = await cloudinary.uploader.upload(image.path, {
                folder: 'products/images',
                resource_type: 'image',
                transformation: [
                  { width: 400, height: 400, crop: "limit"}
                ]
              });
              return {
                public_id: result.public_id,
                name: image.originalname,
                url: result.secure_url,
                size: result.bytes,
                isThumbnail: index == req.body.thumbnailImageIndex ? true : false,
              };
            })
          );
          
        console.log("uploadedImages-->", JSON.stringify(uploadedImages))

        const thumbnailResult = await cloudinary.uploader.upload( req.files['thumbnail'][0].path, {
          folder: 'products/thumbnails',
          resource_type: 'image',
          transformation: [
            { width: 400, height: 400, crop: "limit"} 
          ]
        });
        const thumbnailImage = {
            public_id: thumbnailResult.public_id,
            name: req.files['thumbnail'][0].originalname,
            url: thumbnailResult.secure_url,
            size: thumbnailResult.bytes,
          
        }
        console.log("thumbnailImage-->", JSON.stringify(thumbnailImage))

        const productDatas = {
            title: req.body.title, 
            subtitle: req.body.subtitle,
            brand: req.body.brand,
            category: req.body.category,
            subCategory: req.body.subCategory,
            targetMuscles: req.body.targetMuscles || [],
            description: req.body?.description || '',
            additionalInformation: req.body?.additionalInformation || [],
            tags: req.body?.tags|| [],
            images: uploadedImages,
            thumbnail: thumbnailImage
        }
        for(field in productDatas){
            !productDatas[field] && delete productDatas[field]
        }
        console.log("productData--->", JSON.stringify(productDatas))

        return productDatas
    }
    catch(error){
        console.log("Error in packProductData function-->"+error.message);
    }
}


const createProduct = async (req, res, next)=> {
  try {
    console.log("Inside createProduct controller -->", req.body.title)

    const productData = await packProductData(req, next)

    const {variantType} = req.body

    const variantValue = Array.isArray(req.body[variantType]) ? req.body[variantType] : [req.body[variantType]]
    const stock = Array.isArray(req.body.stock) ? req.body.stock : [req.body.stock]
    const price = Array.isArray(req.body.price) ? req.body.price : [req.body.price]
    if (variantValue.length !== stock.length) {
      next(errorHandler(400,`${variantType} and stocks count must match.!`))
    }
    if (variantValue.length !== price.length) {
      next(errorHandler(400,`${variantType} and price count must match.!`))
    }

    if (!variantType){
      const newProduct = new Product(productData)
      const saved = await newProduct.save();
      return res.status(201).json({createdProduct: true, mainProduct: saved});
    }

    const variantValues = req.body[`${variantType}`] || []
    const stocks = req.body.stock || []
    const prices = req.body.price || []

    const mainProduct = new Product({
      ...productData,
      [variantType.slice(0, -1)]: variantValues[0],
      variantType: variantType.slice(0, -1),
      stock: stocks[0],
      price: prices[0],
      variantOf: null,
      variants: [],
    })

    const savedMain = await mainProduct.save();
    const createdVariants = []

    for (let i = 1; i < variantValues.length; i++) {
      const variant = new Product({
        ...productData,
        [variantType.slice(0, -1)]: variantValues[i],
        variantType: variantType.slice(0, -1),
        stock: stocks[i],
        price: prices[i],
        variantOf: savedMain._id,
      });

      const savedVariant = await variant.save();
      createdVariants.push(savedVariant)
      savedMain.variants.push(savedVariant._id)
    }

    await savedMain.save()

    res.status(201).json({
      createdProduct: true,
      mainProduct: savedMain,
      variants: createdVariants.length ? createdVariants : null,
    });
  }
  catch (error) {
    console.log("Error in productController-createProduct -->", error.message)
    next(error)
  }
}



// const getSingleProduct = async (req, res, next) => {
//     try {
//         console.log("Inside getSingleProduct of productController")
//         const {id} = req.params;
//         const product = await Product.find({_id: id});
//         console.log("Product-->", product)
//         if(!product) next(errorHandler(400,"No such product available!"))
//         res.status(200).json(product);
//     }
//     catch (error) {
//         console.log("Error in productController-getSingleProduct-->"+error.message);
//         next(error)
//     }
//   }


const getSingleProduct = async (req, res, next)=> {
  try {
    console.log("Inside getSingleProduct of productController")
    const {id} = req.params

    const product = await Product.findById(id)
      .populate({
        path: "variants",
        select: "weight size motorPower color stock price",
      })
      .lean()

    if (!product){
      return next(errorHandler(404, "No such product available!"))
    }

    const variantKey = product.variantType

    let mergedProduct = { ...product }

    if (!product.variantOf){
      console.log('Its the main product')
      const variants = product.variants || []

      const variantValues = variantKey
        ? [product[variantKey], ...variants.map((v) => v[variantKey])].filter(Boolean)
        : []
      const prices = [product.price, ...variants.map((v) => v.price)]
      const stocks = [product.stock, ...variants.map((v) => v.stock)]
      const totalStock = stocks.reduce((sum, s) => sum + (s || 0), 0)

      mergedProduct = {
        ...product,
        ...(variantKey ? { [`${variantKey}s`]: variantValues } : {}),
        prices,
        stocks,
        totalStock,
      }
    }else{
      console.log('Not the main product')
      const mainProduct = await Product.findById(product.variantOf)
        .populate({
          path: "variants",
          select: "weight size motorPower color stock price",
        })
        .lean()

      if (mainProduct){
        const variantKeyMain = mainProduct.variantType

        const variantValues = variantKeyMain
          ? [mainProduct[variantKeyMain], ...mainProduct.variants.map((v) => v[variantKeyMain])].filter(Boolean) : []
        const prices = [mainProduct.price, ...mainProduct.variants.map((v) => v.price)]
        const stocks = [mainProduct.stock, ...mainProduct.variants.map((v) => v.stock)]
        const totalStock = stocks.reduce((sum, s) => sum + (s || 0), 0)

        mergedProduct = {
          ...product,
          mainProduct,
          ...(variantKeyMain ? { [`${variantKeyMain}s`]: variantValues } : {}),
          prices,
          stocks,
          totalStock,
        }
      }
    }
    res.status(200).json({ product: mergedProduct });
  }
  catch (error){
    console.log("Error in productController-getSingleProduct -->", error.message)
    next(error)
  }
}



const getAllProducts = async (req, res, next)=> {
    try {
      console.log("Inside getAllProducts controller--")
  
      const {queryOptions} = req.body
      console.log("queryOptions-->", JSON.stringify(queryOptions))
      console.log("queryOptions.filter-->", JSON.stringify(queryOptions.filter))
      console.log("queryOptions.searchData-->", JSON.stringify(queryOptions.searchData))
  
      let filters = {}
      let sortCriteria = {}
      let skipables = 0
      let limit = 0

      if (queryOptions?.searchData && queryOptions.searchData.trim() !== '') {
        console.log("Inside queryOptions.searchData")
        filters.$or = [
          { title: { $regex: queryOptions.searchData, $options: "i" } },
          { subtitle: { $regex: queryOptions.searchData, $options: "i" } },
        ]
      }
  
      if (queryOptions?.filter?.brands && queryOptions?.filter?.brands.length > 0) {
        filters.brand = queryOptions.filter.brands 
      }
      if (queryOptions?.filter?.categories && queryOptions?.filter?.categories.length > 0) {
        filters.category = { $in: queryOptions.filter.categories }
      }
      if (queryOptions?.filter?.subCategories && queryOptions?.filter?.subCategories.length > 0) {
        filters.subCategory = queryOptions.filter.subCategories
      }
      if (queryOptions?.filter?.targetMuscles && queryOptions?.filter?.targetMuscles.length > 0) {
        filters.targetMuscles = queryOptions.filter.targetMuscles
      }
      if (queryOptions?.filter?.products && queryOptions?.filter?.products.length > 0) {
        filters.title = { $in: queryOptions.filter.products }
      }
      
      if (queryOptions?.filter?.maxPrice){
        if(queryOptions.filter.maxPrice !== MAXPRICE){
          console.log("Inside queryOptions.filter.maxPrice !== MAXPRICE")
          filters.price = { $gte: queryOptions.filter.minPrice, $lte: queryOptions.filter.maxPrice }
        }else{
          console.log("Inside queryOptions.filter.maxPrice == MAXPRICE")
          filters.price = { $gte: queryOptions.filter.minPrice }
        }
      }
      if(!queryOptions?.filter?.maxPrice && queryOptions?.filter?.minPrice){
        filters.price = { $gte: queryOptions.filter.minPrice }
      }

      if (queryOptions?.status && queryOptions?.status !== 'all') {
        filters.isBlocked = queryOptions.status === 'blocked'
      }
      if (queryOptions?.startDate || queryOptions?.endDate) {
        filters.createdAt = {}
        if (queryOptions.startDate) {
          filters.createdAt.$gte = new Date(queryOptions.startDate)
        }
        if (queryOptions.endDate) {
          filters.createdAt.$lte = new Date(queryOptions.endDate)
        }
      }
  
      if (queryOptions?.sort) {
        for (const sortKey in queryOptions.sort){
          const sortOrder = queryOptions.sort[sortKey]
          if(sortKey === 'featured') {
            sortCriteria = { ratings: -1 }
          } else if(sortKey === 'bestSellers'){
            sortCriteria = { totalReviews: -1 }
          } else if(sortKey === 'newestArrivals'){
            sortCriteria = { createdAt: -1 }
          } else{
            sortCriteria[sortKey] = Number.parseInt(sortOrder)
          }
        }
        console.log("sortCriteria---->", JSON.stringify(sortCriteria))
      }
  
      if (queryOptions?.limit) {
        limit = parseInt(queryOptions.limit)
      }
      if (queryOptions?.page) {
        skipables = (parseInt(queryOptions.page) - 1) * limit
      }
  
      // const productListQuery = Product.find(filters).sort(sortCriteria).skip(skipables).limit(limit);
  
      // const productBundle = await productListQuery.exec()
      // const productCounts = await Product.countDocuments(filters)

      // const maxPriceAggregation = await Product.aggregate([
      //   { $match: filters }, 
      //   { $group: { _id: null, maxPrice: { $max: "$price" } } },
      // ])

      // const maxPriceAvailable = maxPriceAggregation[0]?.maxPrice || 100000;
  
      // res.status(200).json({ productBundle, productCounts, maxPriceAvailable })

      const mainFilter = { ...filters, variantOf: { $in: [null, undefined] } }

      const mainProducts = await Product.find(mainFilter)
        .populate({
          path: "variants",
          select: "weight size motorPower color stock price",
        })
        .sort(sortCriteria)
        .skip(skipables)
        .limit(limit)
        .lean()

      const mergedProducts = mainProducts.map((main) => {
        const variants = main.variants || []
        const variantKey = main.variantType

        const variantValues = variantKey
          ? [main[variantKey], ...variants.map((v) => v[variantKey])].filter(Boolean)
          : []
        const prices = [main.price, ...variants.map((v) => v.price)]
        const stocks = [main.stock, ...variants.map((v) => v.stock)]
        const totalStock = stocks.reduce((sum, s) => sum + (s || 0), 0)

        return {
          ...main,
          ...(variantKey ? { [`${variantKey}s`]: variantValues } : {}),
          prices,
          stocks,
          totalStock,
        }
      })

      const productCounts = await Product.countDocuments(mainFilter)

      const maxPriceAggregation = await Product.aggregate([
        { $match: filters },
        { $group: { _id: null, maxPrice: { $max: "$price" } } },
      ])

      const maxPriceAvailable = maxPriceAggregation[0]?.maxPrice || 100000

      res.status(200).json({productBundle: mergedProducts, productCounts, maxPriceAvailable})
    }
    catch (error){
      console.log("Error in productController-getProducts -->", error.message)
      next(error)
    }
}


const getLatestProducts = async (req, res, next)=> {
  try {
    console.log("Inside getLatestProducts of productController")

    const mainProducts = await Product.find({ isBlocked: false, variantOf: { $in: [null, undefined] } })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate({
        path: "variants",
        select: "weight size motorPower color stock price",
      })
      .lean()

    const formattedProducts = mainProducts.map((main) => {
      const variants = main.variants || []
      const variantKey = main.variantType

      const variantValues = variantKey
        ? [main[variantKey], ...variants.map((v) => v[variantKey])].filter(Boolean)
        : []
      const prices = [main.price, ...variants.map((v) => v.price)]
      const stocks = [main.stock, ...variants.map((v) => v.stock)]
      const totalStock = stocks.reduce((sum, s) => sum + (s || 0), 0)

      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      return {
        id: main._id,
        image: main.thumbnail?.url || "",
        title: main.title,
        subtitle: main.subtitle,
        totalStock,
        price: minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`,
        ...(variantKey ? { [`${variantKey}s`]: variantValues } : {}),
      }
    })

    console.log("Latest products ---->", formattedProducts)
    res.status(200).json({ latestProducts: formattedProducts });
  } 
  catch (error) {
    console.log("Error in productController-getLatestProducts -->", error.message)
    next(error)
  }
}


const getPopularProducts = async (req, res, next)=> {
  try {
    console.log("Inside getPopularProducts of productController")

    const mainProducts = await Product.find({
      isBlocked: false,
      variantOf: { $in: [null, undefined] },
    })
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(9)
      .populate({
        path: "variants",
        select: "weight size motorPower color stock price",
      })
      .lean()

    const formattedProducts = mainProducts.map((main) => {
      const variants = main.variants || []
      const variantKey = main.variantType

      const variantValues = variantKey
        ? [main[variantKey], ...variants.map((v) => v[variantKey])].filter(Boolean)
        : []
      const prices = [main.price, ...variants.map((v) => v.price)]
      const stocks = [main.stock, ...variants.map((v) => v.stock)]
      const totalStock = stocks.reduce((sum, s) => sum + (s || 0), 0)

      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      return {
        id: main._id,
        name: main.title,
        image: main.thumbnail?.url || "",
        totalStock,
        price: minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`,
        ...(variantKey ? { [`${variantKey}s`]: variantValues } : {}),
      }
    })

    console.log("Popular products →", formattedProducts)
    res.status(200).json({ popularProducts: formattedProducts });
  } 
  catch (error) {
    console.log("Error in productController-getPopularProducts -->", error.message)
    next(error)
  }
}


const getSimilarProducts = async (req, res, next)=> {
  try {
    console.log("Inside getSimilarProducts of productController")
    console.log("req.body-------->", req.body)

    const { productIds } = req.body

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return next(errorHandler(400, "Please provide an array of product IDs"))
    }

    console.log("productIds---->", productIds)

    const referenceProducts = await Product.find({ _id: { $in: productIds } })

    if (referenceProducts.length === 0) {
      return next(errorHandler(404, "No reference products found"))
    }

    const allCategories = new Set()
    const allTags = new Set()

    referenceProducts.forEach((prod) => {
      prod.category?.forEach((c) => allCategories.add(c));
      prod.tags?.forEach((t) => allTags.add(t));
    })

    const similarMainProducts = await Product.find({
      isBlocked: false,
      variantOf: { $in: [null, undefined] },
      _id: { $nin: productIds },
      $or: [
        { category: { $in: Array.from(allCategories) } },
        { tags: { $in: Array.from(allTags) } },
      ],
    })
      .limit(12)
      .populate({
        path: "variants",
        select: "weight size motorPower color stock price",
      })
      .lean()

    const formattedSimilarProducts = similarMainProducts.map((main) => {
      const variants = main.variants || []
      const variantKey = main.variantType

      const variantValues = variantKey
        ? [main[variantKey], ...variants.map((v) => v[variantKey])].filter(Boolean)
        : []
      const prices = [main.price, ...variants.map((v) => v.price)]
      const stocks = [main.stock, ...variants.map((v) => v.stock)]
      const totalStock = stocks.reduce((sum, s) => sum + (s || 0), 0)

      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      let discountLabel = null
      if (main.discountType === "percentage") {
        discountLabel = `-${main.discountValue}%`
      } else if (main.discountType === "fixed" && main.discountValue > 0) {
        discountLabel = `-₹${main.discountValue}`
      }

      return {
        id: main._id,
        name: main.title,
        image: main.thumbnail?.url || "",
        totalStock,
        averageRating: main?.averageRating || 0,
        totalReviews: main?.totalReviews || 0,
        price: minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`,
        ...(variantKey ? { [`${variantKey}s`]: variantValues } : {}),
        ...(discountLabel && { discount: discountLabel }),
      }
    })

    console.log("Similar products →", formattedSimilarProducts)
    res.status(200).json({ similarProducts: formattedSimilarProducts });
  }
  catch (error) {
    console.log("Error in productController-getSimilarProducts -->", error.message)
    next(error)
  }
}


const searchProduct = async (req, res, next) => {
  try {
      console.log("Inside searchProduct of productController")
      const {find} = req.query
      console.log("find---->", find);

    if (!find) {
      return next(errorHandler(400, "No search query provided"))
    }

    const filter = {
      $or: [
        { title: { $regex: find, $options: "i" } },
        { subtitle: { $regex: find, $options: "i" } },
      ],
      isBlocked: false,
    }

    const products = await Product.find(filter)
      .populate({
        path: "variants",
        select: "weight size motorPower color stock price",
      })
      .lean()

    if (!products.length) {
      return next(errorHandler(404, "No products match your search!"));
    }

    const formattedProducts = products.map((product) => {
      const variantKey = product.variantType;
      let variantValues = []
      let prices = [product.price]
      let stocks = [product.stock]
      let totalStock = product.stock || 0;

      if (product.variants?.length > 0) {
        variantValues = variantKey
          ? [product[variantKey], ...product.variants.map((v) => v[variantKey])].filter(Boolean)
          : []
        prices = [product.price, ...product.variants.map((v) => v.price)]
        stocks = [product.stock, ...product.variants.map((v) => v.stock)]
        totalStock = stocks.reduce((sum, s) => sum + (s || 0), 0)
      }

      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      let discountLabel = null;
      if (product.discountType === "percentage") {
        discountLabel = `-${product.discountValue}%`
      } else if (product.discountType === "fixed" && product.discountValue > 0) {
        discountLabel = `-₹${product.discountValue}`
      }

      const priceLabel =
        minPrice !== maxPrice ? `₹${minPrice} - ₹${maxPrice}` : `₹${minPrice}`

      return {
        id: product._id,
        name: product.title,
        price: priceLabel,
        image: product.thumbnail?.url || "",
        variantType: variantKey || null,
        variantValues,
        totalStock,
        ...(discountLabel && { discount: discountLabel }),
      }
    })

    const allPrices = formattedProducts.flatMap((p) =>
      typeof p.price === "string"
        ? p.price
            .replace(/[₹\s]/g, "")
            .split("-")
            .map(Number)
        : []
    )
    const maxPriceAvailable = Math.max(...allPrices, 100000)

    res.status(200).json({
      products: formattedProducts,
      productCounts: products.length,
      maxPriceAvailable,
    });

  } 
  catch (error) {
    console.log("Error in productController-searchProduct --> " + error.message)
    next(error)
  }
}


const updateProduct = async (req, res, next) => {
  try {
    console.log("Inside updateProduct controller--")

    const {id} = req.params
    console.log("Id from params -->", id)

    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
      return next(errorHandler(404, "No such product available to update"))
    }

    const updatedData = await packProductData(req, next)

    const { variantType } = req.body

    if (!variantType) {
      const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updatedData }, { new: true })
      return res.status(200).json({ updatedProduct: true, product: updatedProduct })
    }

    const variantValues = Array.isArray(req.body[variantType]) ? req.body[variantType] : [req.body[variantType]]
    const stocks = Array.isArray(req.body.stock) ? req.body.stock : [req.body.stock]
    const prices = Array.isArray(req.body.price) ? req.body.price : [req.body.price]

    if (variantValues.length !== stocks.length) {
      return next(errorHandler(400, `${variantType} and stock count must match!`))
    }
    if (variantValues.length !== prices.length) {
      return next(errorHandler(400, `${variantType} and price count must match!`))
    }

    const mainUpdate = {
      ...updatedData,
      [variantType.slice(0, -1)]: variantValues[0],
      variantType: variantType.slice(0, -1),
      stock: stocks[0],
      price: prices[0],
    }

    const updatedMain = await Product.findByIdAndUpdate(id, { $set: mainUpdate }, { new: true })

    const existingVariants = await Product.find({ variantOf: id })
    const updatedVariants = []

    if (existingVariants.length !== variantValues.length - 1) {
      await Product.deleteMany({ variantOf: id })
      updatedMain.variants = []
    }

    for (let i = 1; i < variantValues.length; i++) {
      const variantPayload = {
        ...updatedData,
        [variantType.slice(0, -1)]: variantValues[i],
        variantType: variantType.slice(0, -1),
        stock: stocks[i],
        price: prices[i],
        variantOf: updatedMain._id,
      }

      let variantDoc;
      if (existingVariants[i - 1]){
        variantDoc = await Product.findByIdAndUpdate(existingVariants[i - 1]._id, { $set: variantPayload }, { new: true })
      } else{
        variantDoc = await new Product(variantPayload).save()
      }

      updatedVariants.push(variantDoc)
      updatedMain.variants.push(variantDoc._id)
    }

    await updatedMain.save()

    res.status(200).json({
      updatedProduct: true,
      mainProduct: updatedMain,
      variants: updatedVariants.length ? updatedVariants : null,
    });
  } 
  catch (error){
    console.log("Error in productController-updateProduct -->", error.message)
    next(error)
  }
}


  const toggleProductStatus = async (req, res, next)=> {
    try {
      console.log("Inside toggleProductStatus controller--")
      const { id } = req.params
      console.log("ID -->", id)
      
      const product = await Product.findById(id).populate({
        path: "variants",
        select: "isBlocked title variantOf variantType",
      })

      if (!product) {
        return next(errorHandler(404, "No such product found!"))
      }

      const newStatus = !product.isBlocked
      product.isBlocked = newStatus
      await product.save()

      if (product.variants?.length > 0) {
        await Product.updateMany(
          { _id: { $in: product.variants.map((v) => v._id) } },
          { $set: { isBlocked: newStatus } }
        )
        console.log(`Updated all ${product.variants.length} variants → ${newStatus ? "Blocked" : "Unblocked"}`)
      }

      if (product.variantOf) {
        await Product.findByIdAndUpdate(product.variantOf, { $set: { isBlocked: newStatus } })
        console.log(`Also ${newStatus ? "blocked" : "unblocked"} main product → ${product.variantOf}`)
      }

      const statusText = newStatus ? "Blocked" : "Unblocked"

      res.status(200).json({
        message: `Product and its variants ${statusText} successfully`,
        productId: id,
        productBlocked: statusText,
        variantSync: product.variants?.length || 0,
      });

    } 
    catch (error) {
      console.log("Error in toggleProductStatus controller -->", error.message)
      next(error)
    }
}


const exportProductsAsCsv = async (req, res, next)=> {
  try {
    console.log("Inside exportProductsAsCsv in productController--")
    const { products } = req.body

    if (!products || products.length === 0) {
      return next(errorHandler(404, "No products found"))
    }

    const formattedProducts = products.map((product)=> {
      const variantType = product.variantType || null

      const formatArray = (arr)=>
        Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "";

      let priceLabel = `₹${product.price}`;
      if (Array.isArray(product.prices) && product.prices.length > 1) {
        const min = Math.min(...product.prices)
        const max = Math.max(...product.prices)
        priceLabel = min === max ? `₹${min}` : `₹${min} - ₹${max}`
      }

      return {
        Name: product.title,
        Category: Array.isArray(product.category)
          ? product.category.join(", ")
          : product.category,
        Weights:
          variantType === "weight" ? formatArray(product.weights) : "",
        Colors: variantType === "color" ? formatArray(product.colors) : "",
        Sizes: variantType === "size" ? formatArray(product.sizes) : "",
        "Motor Powers":
          variantType === "motorPower"
            ? formatArray(product.motorPowers)
            : "",
        Price: priceLabel,
        "Discount Type": product.discountType || "-",
        "Discount Value": product.discountValue || 0,
        "Total Stock": product.totalStock ?? product.stock,
        "Block Status": product.isBlocked ? "Blocked" : "Active",
        "Created On": new Date(product.createdAt).toLocaleDateString(),
      }
    })

    const fields = [
      "Name",
      "Category",
      "Weights",
      "Colors",
      "Sizes",
      "Motor Powers",
      "Price",
      "Discount Type",
      "Discount Value",
      "Total Stock",
      "Block Status",
      "Created On",
    ];

    const json2csv = new Parser({ fields, quote: '"' })
    const csv = json2csv.parse(formattedProducts)

    res.header("Content-Type", "text/csv; charset=utf-8")
    res.attachment("products.csv")
    res.send(csv)
  }
  catch (error){
    console.error("Error exporting products:", error.message)
    next(error)
  }
}


  const exportProductsAsPdf = async (req, res, next) => {
    try {
      const { products } = req.body
      if (!products || products.length === 0) {
        return next(errorHandler(404, "No products found"))
      }

      const doc = new PDFDocument({ margin: 30, size: "A4" })
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", "attachment; filename=products.pdf")

      doc.pipe(res)

      doc.fontSize(16).text("Product List", { align: "center" })
      doc.moveDown(0.5)
      doc.fontSize(10).text(`Total products: ${products.length}`)
      doc.moveDown(1)

      const colConfig = [
        { name: "Title", width: 90, x: 30 },
        { name: "Category", width: 80, x: 130 },
        { name: "Variants", width: 60, x: 220 },
        { name: "Prices", width: 50, x: 280 },
        { name: "Discount", width: 50, x: 360 },
        { name: "Stock", width: 40, x: 410 },
        { name: "Blocked", width: 40, x: 450 },
        { name: "Created", width: 50, x: 500 }
      ];

      doc.font("Helvetica-Bold").fontSize(9)
      const startY = doc.y

      colConfig.forEach(col => {
        doc.text(col.name, col.x, startY)
      })

      doc.moveTo(30, startY + 15).lineTo(570, startY + 15).stroke()
      doc.y = startY + 20

      doc.font("Helvetica").fontSize(8)

      const variantSymbol = {weight: ' Kg', motorPower: ' Hp', color: '', size: ''}
      const discount = (discountType, discountValue)=> {
        if(discountType === 'percentage') return `${discountValue} %`
        else return `₹ ${discountValue}`
      }

      products.forEach((product, index)=> {
        const rowY = doc.y
        if (index % 2 === 0) {
          doc.rect(30, rowY - 3, 540, 15).fill('#f5f5f5')
        }
        doc.fillColor('#000000')

        const rowData = [
          product.title ? String(product.title).length > 25 
            ? String(product.title).substring(0, 25) + '...' : String(product.title) : "N/A",
          product.category ? String(product.category).length > 32 
            ? String(product.category).substring(0, 32) + '...' : String(product.category) : "N/A",
          product[`${product.variantType}s`] 
            ? String(product[`${product.variantType}s`]).length > 32 
            ? String(product[`${product.variantType}s`]).substring(0, 32) + '...' + variantSymbol[product.variantType]
            : String(product[`${product.variantType}s`]) + variantSymbol[product.variantType] : "N/A",
          product.prices ? String(product.prices) : "N/A",
          product.discountValue ? String(discount(product.discountType, product.discountValue)) : "N/A",
          product.totalStock ? String(product.totalStock) : "N/A",
          product.isBlocked ? 'Yes' : 'No' ,
          product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"
        ]

        colConfig.forEach((col, i) => {
          doc.text(rowData[i], col.x, rowY, { width: col.width })
        })

        doc.moveDown(1)
        if (doc.y > 700) {
          doc.addPage();
          doc.y = 30;
        }
      })

      doc.end()

    }
    catch (error){
      console.error("Error exporting products to PDF:", error.message)
      if (!res.headersSent){
        return next(error)
      }else{
        console.error("Headers already sent, cannot send error response")
      }
    }
  }


module.exports = {createProduct, getSingleProduct, getAllProducts, getLatestProducts, getPopularProducts, getSimilarProducts, 
  searchProduct, updateProduct, toggleProductStatus, exportProductsAsCsv, exportProductsAsPdf}