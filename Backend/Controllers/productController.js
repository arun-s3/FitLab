const Product = require('../Models/productModel')
const {errorHandler} = require('../Utils/errorHandler')

const createProduct = async(req,res,next)=>{
    try {
        const requiredField = ["name", "description", "price", "brand", "images", "thumbnail", "category", "stock", "user"]
        for(let field of requiredField){
            if (req.body[field].trim() == "") next(errorHandler(400, "Please fill all the required fields!"))
        }
        const newProduct = await Product.save(req.body);
        res.status(201).json({success:'true', product:newProduct});  
    } 
    catch (error) {
        console.log("Error in productController-createUser-->"+error.message);
        next(error)
    }
}

const getSingleProduct = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await Product.find({_id:id});
        if(!product) next(errorHandler(400,"No such product available!"))
        res.status(200).json(product);
    }
    catch (error) {
        console.log("Error in productController-getSingleProduct-->"+error.message);
        next(error)
    }
  };

const getProducts = async(req,res,next)=>{
    
    try{
        const productList = await Product.find({})
        let resultList = {}

        if(req.query.brand){
            const brands = req.query.brand
            resultList = productList.find({brand:{$in:brands.split(',')}})
        }
        if(req.query.category){
            const categories = req.query.catgeory
            resultList = productList.find({category:{$in:categories.split(',')}})
        }
        if(req.query.limit && req.query.page){
            const page = req.query.page
            const limit = req.query.limit
            const skipables = (page-1)*limit
            resultList = productList.skip(skipables).limit(limit)
        }
        if(req.query.order && req.query.sort){
            resultList = productList.sort({[req.quer.sort]:req.query.order})
        }

        docList = await resultList.exec()
        res.status(200).json({docList})
    }
    catch(error){
        console.log("Error in productController-getProducts-->"+error.message);
        next(error)
    }
}

const updateProduct = async (req, res, next) => {    
    try {
        const {id} = req.params;
        const product = await Product.find()
        if(product){
            const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
            const updatedProduct = await product.save()
            res.status(200).json(updatedProduct);
        }
       else{ next(errorHandler(400, "No such product available to update"))}
    } catch (error) {
        console.log("Error in productController-updateProduct-->"+error.message);
        next(error)
    }
  };

module.exports = {createProduct, getSingleProduct, getProducts, updateProduct}