const Product = require('../Models/productModel')
const cloudinary = require('../Utils/cloudinary')
const {errorHandler} = require('../Utils/errorHandler') 

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
        const product = await Product.find({_id:id});
        console.log("Product-->", product)
        if(!product) next(errorHandler(400,"No such product available!"))
        res.status(200).json(product);
    }
    catch (error) {
        console.log("Error in productController-getSingleProduct-->"+error.message);
        next(error)
    }
  };

const getAllProducts = async(req,res,next)=>{
    try{
        console.log("Inside getAllProducts controller--")
        const productList = Product.find({})
        console.log("req.body-->", JSON.stringify(req.body))
        const {queryOptions} = req?.body
        let resultList = {}

        if (Object.keys(queryOptions).length>0){
            if(queryOptions?.brands){
                const brands = queryOptions.brands
                resultList = productList.find({brand:{$in:brands}})
            }
            if(queryOptions?.categories){
                const categories = queryOptions.categories
                resultList = productList.find({category:{$in:categories}})
            }
            if(queryOptions?.products){
                const products = queryOptions.products
                resultList = productList.find({title:{$in:products}})
            }
            if(queryOptions?.minPrice && queryOptions?.maxPrice){``
                const minPrice = queryOptions.minPrice
                const maxPrice = queryOptions.maxPrice
                resultList = productList.find({ $and: [{price: {$gte:minPrice}}, {price: {$lte:maxPrice}}]})
            }
            if(queryOptions?.maxPrice){
                const minPrice = queryOptions.minPrice
                resultList = productList.find({price:{$gte:minPrice}})
            }
            if(queryOptions?.status && queryOptions?.status !== 'all'){
                const status = queryOptions.status 
                const isBlocked = status == 'blocked'? true : false
                resultList = productList.find({isBlocked})
            }
            if(queryOptions?.startDate || queryOptions?.endDate){
                const startDate = queryOptions.startDate
                const endDate = queryOptions.endDate
                if(!queryOptions.startDate){
                    resultList = productList.find({createdAt: {$lte: endDate}})
                }
                else if(!queryOptions.endDate){
                    resultList = productList.find({createdAt: {$gte: startDate}})
                }
                else{
                    resultList = productList.find({createdAt: {$gte: startDate, $lte: endDate}})
                }
            }
            if(queryOptions?.sort){
                const sorts = queryOptions.sort
                for(sortKey in sorts){
                    if(sortKey !== ('featured' || 'bestSellers' || 'newestArrivals')){
                        resultList = productList.sort({[sortKey]: sorts[sortKey] })
                    }
                    if(sortKey == 'featured'){
    
                    }
                    if(sortKey == 'bestSellers'){
                        
                    }
                    if(sortKey == 'newestArrivals'){
                        
                    }
                }
            }
            if(queryOptions?.limit && queryOptions?.page){
                const skipables = (queryOptions.page - 1) * queryOptions.limit
                resultList = productList.skip(skipables).limit(queryOptions.limit)
            }
        }
        else{
            resultList = productList
        }

        const productCounts = await Product.countDocuments(resultList)
        const productBundle = await resultList.exec()
        res.status(200).json({productBundle, productCounts})
    }
    catch(error){
        console.log("Error in productController-getProducts-->"+error.message);
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

module.exports = {createProduct, getSingleProduct, getAllProducts, updateProduct, toggleProductStatus}