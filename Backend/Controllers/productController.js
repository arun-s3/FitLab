const Product = require('../Models/productModel')
const cloudinary = require('../Utils/cloudinary')

const {Parser} = require("json2csv")
const PDFDocument = require("pdfkit")
require("pdfkit-table")

const jsPDF = require('jspdf').jsPDF;
require('jspdf-autotable');

const path = require("path")


const {errorHandler} = require('../Utils/errorHandler')

const MAXPRICE = 500000


const packProductData = async (req)=>{
    try{
        console.log("req.body-->", JSON.stringify(req.body))
        console.log("req.files-->", JSON.stringify(req.files))
        console.log("Image path:", req.files['images'][0].path);
        console.log("Thumbnail path:", req.files['thumbnail'][0].path);
        
        // const uploadedImages = []
        // for (let i=0; i<req.files['images'].length; i++) {
        //     const result = await cloudinary.uploader.upload(req.files['images'][i].path, {
        //       folder: 'products/images', 
        //       resource_type: 'image' 
        //     });
        //     uploadedImages.push({
        //         public_id: result.public_id,
        //         name: req.files['images'][i].originalname,
        //         url: result.secure_url, 
        //         size: result.bytes,
        //         isThumbnail: i == req.body.thumbnailImageIndex? true : false
        //     });
        //   }
        const uploadedImages = await Promise.all(
            req.files['images'].map(async (image, index) => {
              const result = await cloudinary.uploader.upload(image.path, {
                folder: 'products/images',
                resource_type: 'image',
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
          resource_type: 'image'
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
            price: req.body.price,
            stock: req.body.stock,
            weights: req.body?.weights|| [],
            brand: req.body.brand,
            category: req.body.category,
            description: req.body?.description || '',
            additionalInformation: req.body?.additionalInformation || [],
            tags: req.body?.tags|| [],
            images: uploadedImages,
            thumbnail: thumbnailImage
        }
        for(field in productDatas){
            !productDatas[field] && delete productDatas[field]
        }
        console.log("Weights-->" ,productDatas.weights)
        console.log("Weights Array?-->" ,Array.isArray(productDatas.weights))
        console.log("Tags Array?-->" ,Array.isArray(productDatas.tags))
        console.log("productData--->", JSON.stringify(productDatas))

        return productDatas
    }
    catch(error){
        console.log("Error in packProductData function-->"+error.message);
    }
}


const createProduct = async(req,res,next)=>{
    try {
        console.log("Inside createProduct controller, received productForm-->", JSON.stringify(req.body.title))
        const productDatas = await packProductData(req)
        console.log("productData's description--->", productDatas.description)
        const newProduct = new Product(productDatas)
        console.log("newProduct's description--->", newProduct.description)
        const savedProduct = await newProduct.save();
        console.log("saved Product's title--->", savedProduct.title)
        res.status(201).json({createdProduct:'true', product:savedProduct});  
    } 
    catch (error) { 
        console.log("Error in productController-createUser-->"+error.message);
        next(error)
    }
}


const getSingleProduct = async (req, res, next) => {
    try {
        console.log("Inside getSingleProduct of productController")
        const {id} = req.params;
        const product = await Product.find({_id: id});
        console.log("Product-->", product)
        if(!product) next(errorHandler(400,"No such product available!"))
        res.status(200).json(product);
    }
    catch (error) {
        console.log("Error in productController-getSingleProduct-->"+error.message);
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
  
      if (queryOptions?.brands) {
        filters.brand = { $in: queryOptions.brands }
      }
      if (queryOptions?.filter?.categories && queryOptions?.filter?.categories.length > 0) {
        filters.category = { $in: queryOptions.filter.categories }
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
            sortCriteria[sortKey] = Number.parseInt(sortOrder);
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
  
      const productListQuery = Product.find(filters).sort(sortCriteria).skip(skipables).limit(limit);
  
      const productBundle = await productListQuery.exec()
      const productCounts = await Product.countDocuments(filters)

      const maxPriceAggregation = await Product.aggregate([
        { $match: filters }, 
        { $group: { _id: null, maxPrice: { $max: "$price" } } },
      ])

      const maxPriceAvailable = maxPriceAggregation[0]?.maxPrice || 100000;
  
      res.status(200).json({ productBundle, productCounts, maxPriceAvailable })
    }
    catch (error){
      console.log("Error in productController-getProducts -->", error.message)
      next(error)
    }
}


const getLatestProducts = async (req, res, next)=> {
  try {
    console.log("Inside getLatestProducts of productController")

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .select("_id title subtitle thumbnail")

    const formattedProducts = products.map((product)=> ({
      id: product._id,
      image: product.thumbnail?.url || "",  
      title: product.title,
      subtitle: product.subtitle,
    }))

    console.log("Latest products---->", formattedProducts)
    res.status(200).json({latestProducts: formattedProducts});
  }
  catch (error){
    console.log("Error in productController-getLatestProducts -->", error.message)
    next(error)
  }
}


const getPopularProducts = async (req, res, next)=> {
  try {
    console.log("Inside getPopularProducts of productController")

    const products = await Product.find({ isBlocked: false })
      .sort({ ratings: -1, totalReviews: -1 }) 
      .limit(9)
      .select("_id title price thumbnail")

    const formattedProducts = products.map((product) => ({
      id: product._id,
      name: product.title,
      price: product.price.toString(), 
      image: product.thumbnail?.url || ""
    }))

    console.log("Popular products →", formattedProducts)
    res.status(200).json({popularProducts: formattedProducts})
  }
  catch (error) {
    console.log("Error in productController-getPopularProducts -->", error.message)
    next(error)
  }
}



const getSimilarProducts = async (req, res, next)=> {
  try {
    console.log("Inside getSimilarProducts of productController")
    console.log('req.body-------->', req.body)
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
      prod.category?.forEach((c)=> allCategories.add(c))
      prod.tags?.forEach((t)=> allTags.add(t))
    })

    const similarProducts = await Product.find({
      isBlocked: false,
      _id: { $nin: productIds }, 
      $or: [
        { category: { $in: Array.from(allCategories) } },
        { tags: { $in: Array.from(allTags) } },
      ],
    })
      .limit(12)
      .select("_id title price thumbnail discountType discountValue")

    const formattedSimilarProducts = similarProducts.map((product)=> {
      let discountLabel = null

      if (product.discountType === "percentage") {
        discountLabel = `-${product.discountValue}%`
      } else if (product.discountType === "fixed" && product.discountValue > 0) {
        discountLabel = `-₹${product.discountValue}`
      }

      return {
        id: product._id,
        name: product.title,
        price: `Rs ${product.price}`,
        image: product.thumbnail?.url || "",
        rating: 5, 
        ...(discountLabel && { discount: discountLabel }),
      }
    }); 

    console.log("Similar products--->", formattedSimilarProducts)

    res.status(200).json({similarProducts: formattedSimilarProducts});
  } 
  catch (error){
    console.log("Error in productController-getSimilarProducts ---->", error.message)
    next(error)
  }
}


const searchProduct = async (req, res, next)=> {
  try {
    console.log("Inside searchProduct of productController")
    const {find} = req.query
    console.log("find---->",find)
    if (!find) {
      return next(errorHandler(400, "No search query provided"))
    }

    const filter = { $or: [
      { title: { $regex: find, $options: "i" } },
      { subtitle: { $regex: find, $options: "i" } }
    ]}

    const products = await Product.find(filter)

    const maxPriceAggregation = await Product.aggregate([
      { $match: filter }, 
      { $group: { _id: null, maxPrice: { $max: "$price" } } },
    ])
    const maxPriceAvailable = maxPriceAggregation[0]?.maxPrice || 100000

    if (!products.length) {
      return next(errorHandler(404, "No products match your search!"))
    }

    res.status(200).json({products, productCounts: products.length, maxPriceAvailable})
  } catch (error) {
    console.log("Error in productController-searchProduct --> " + error.message)
    next(error)
  }
}


const updateProduct = async (req, res, next) => {    
    try {
        console.log("Inside updateProduct controller--")
        const {id} = req.params;
        console.log("Id from params-->",id)
        const product = await Product.findOne({_id: id})
        if(product){
            const productDatas = await packProductData(req)
            const updatedProduct = await Product.updateOne({_id: id}, {$set: productDatas});
            res.status(200).json({updatedProduct:true, product:productDatas});
        }
       else{ next(errorHandler(400, "No such product available to update"))}
    } catch (error) {
        console.log("Error in productController-updateProduct-->"+error.message);
        next(error)
    }
  }


  const toggleProductStatus = async(req,res,next)=>{
    try{
        console.log("Inside toggleProductStatus controller--")
        const {id} = req.params
        console.log("ID-->", id)
        const product = await Product.findOne({_id:id},{password:0})
        if (!product) {
            return next(errorHandler(404, "No such product found!"));
        }
        const status = product.isBlocked
        console.log("Blocked status-->", status)
        const returnedProduct = await Product.findOneAndUpdate({_id:id},{$set: {isBlocked: !status}}, {new: true})
        if(returnedProduct){
            const status = returnedProduct.isBlocked? 'Blocked' : 'Unblocked'
            res.status(200).json({productBlocked: status, productId:id})
        }
        else{
            next(errorHandler(400, "No such product available to update status!"))
        }
    }  
    catch(error){
        console.log("Error in updateProductStatus controller-->", error.message)
        next(error)
    } 
  }


  const exportProductsAsCsv = async (req, res, next)=> {
    try {
      console.log("Inside exportProductsAsCsv in productController--")
      const {products} = req.body
      if (!products || products.length === 0) {
        return next(errorHandler(404, "No products found"))
      }

      const fields = [
        { label: "Name", value: "title" },
        { label: "Category", value: "category" },
        { label: "Weights", value: "weights" },
        { label: "Price", value: "price" },
        { label: "Discount-Type", value: "discountType" },
        { label: "Discunt-value", value: "discountValue" },
        { label: "Stock", value: "stock" },
        { label: "Block-status", value: "isBlocked" },
        { label: "Created On", value: "createdAt" },
      ]

      const json2csv = new Parser({fields})
      const csv = json2csv.parse(products) 

      res.header("Content-Type", "text/csv")
      res.attachment("products.csv")

      return res.send(csv);
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
        { name: "Weight", width: 60, x: 220 },
        { name: "Price", width: 50, x: 290 },
        { name: "Disc Type", width: 50, x: 340 },
        { name: "Disc Value", width: 50, x: 390 },
        { name: "Stock", width: 40, x: 440 },
        { name: "Blocked", width: 40, x: 480 },
        { name: "Created", width: 50, x: 520 }
      ];

      doc.font("Helvetica-Bold").fontSize(9)
      const startY = doc.y

      colConfig.forEach(col => {
        doc.text(col.name, col.x, startY)
      })

      doc.moveTo(30, startY + 15).lineTo(570, startY + 15).stroke()
      doc.y = startY + 20

      doc.font("Helvetica").fontSize(8)

      products.forEach((product, index)=> {
        const rowY = doc.y
        if (index % 2 === 0) {
          doc.rect(30, rowY - 3, 540, 15).fill('#f5f5f5')
        }
        doc.fillColor('#000000')

        const rowData = [
          product.title ? String(product.title).length > 25 ? String(product.title).substring(0, 25) + '...' : String(product.title) : "N/A",
          product.category ? String(product.category).length > 32 ? String(product.category).substring(0, 32) + '...' : String(product.category) : "N/A",
          product.weights ? String(product.weights).length > 32 ? String(product.weights).substring(0, 32) + '...' : String(product.weights) : "N/A",
          product.price ? String(product.price) : "N/A",
          product.discountType ? String(product.discountType) : "N/A",
          product.discountValue ? String(product.discountValue) : "N/A",
          product.stock ? String(product.stock) : "N/A",
          product.isBlocked ? String(product.isBlocked) === 'true' ? 'Yes' : 'No' : "N/A",
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