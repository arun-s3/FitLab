const Offer = require('../Models/offerModel')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel') 
const Category = require('../Models/categoryModel')
const User = require('../Models/userModel')
const cloudinary = require('../Utils/cloudinary')
const {errorHandler} = require('../Utils/errorHandler') 



const createOffer = async (req, res, next)=> {
    try {
        console.log("Inside createOffer of offerController")
        console.log('req.body.offerDetails', JSON.stringify(req.body))
        const {
            name,
            description,
            discountType,
            discountValue,
            minimumOrderValue,
            maxDiscount,
            targetUserGroup,
            applicableType,
            applicableCategories,
            applicableProducts,
            startDate,
            endDate,
            recurringOffer,
            recurringFrequency,
            offerBanner
        } = req.body

        console.log(`name--->${name}, discountType--->${discountType}, startDate--->${startDate}, endDate--->${endDate}`)

        let uploadedImage = null
        if(req.file){
            console.log("req.file-->", JSON.stringify(req.file))
            console.log("Image path:", req.file.path)
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'offer/image',
                resource_type: 'image',
            })
            uploadedImage = {
                public_id: result.public_id,
                name: req.file.originalname,
                url: result.secure_url,
                size: result.bytes,
            }
            console.log("uploadedImage-->", JSON.stringify(uploadedImage))
        }

        if (!name || !discountType || !startDate || !endDate){
            return next(errorHandler(400, "Required fields are missing!"))
        }

        if (discountType === 'percentage' && (!discountValue || discountValue <= 0)){
            return next(errorHandler(400, "Discount value is missing or invalid!"))
        }

        if (new Date(endDate) <= new Date(startDate)){
            return next(errorHandler(400, "End date must be after start date!"))
        }

        const existingOffer = await Offer.findOne({ name: name.trim().toUpperCase() })
        if (existingOffer){
            return next(errorHandler(400, "Offer name already exists!"))
        }

        let categoryIds = []
        if (Array.isArray(applicableCategories) && applicableCategories.length > 0) {
            const categories = await Category.find({ name: { $in: applicableCategories } }, "_id")
            categoryIds = categories.map(cat => cat._id)
        }

        let productIds = [];
        if (Array.isArray(applicableProducts) && applicableProducts.length > 0) {
            const products = await Product.find({ title: { $in: applicableProducts } }, "_id")
            productIds = products.map(prod => prod._id);
        }

        const newOffer = new Offer({
            name: name.trim().toUpperCase(),
            description,
            discountType,
            discountValue,
            minimumOrderValue,
            maxDiscount,
            targetUserGroup,
            applicableType,
            applicableCategories: categoryIds,
            applicableProducts: productIds,
            startDate,
            endDate,
            recurringOffer,
            recurringFrequency,
            offerBanner: uploadedImage
        })

        await newOffer.save();

        return res.status(201).json({ success: true, message: "Offer created successfully!", offer: newOffer })
    } 
    catch (error){
        console.error("Error creating offer:", error.message)
        next(error)
    }
}


const getAllOffers = async (req, res, next) => {
    try {
      console.log("Inside getAllOffers of offerController")
  
      const { queryOptions = {} } = req.body
      const { page = 1, limit = 6, startDate, endDate, sort = -1, sortBy = "createdAt", searchData } = queryOptions
  
      const skip = (page - 1) * limit
      console.log("queryOptions--->", JSON.stringify(queryOptions))
  
      let filterConditions = {}
      if (startDate && endDate) {
        filterConditions.startDate = { $gte: new Date(startDate) }
        filterConditions.endDate = { $lte: new Date(endDate) }
      }
  
      if (searchData) {
        filterConditions.name = { $regex: searchData, $options: "i" };
      }
  
      let sortOptions = {}
      if (["name", "startDate", "endDate", "redemptionCount"].includes(sortBy)) {
        sortOptions[sortBy] = sort
      } else {
        sortOptions.createdAt = sort
      }
  
      const offers = await Offer.find(filterConditions)
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sortOptions)
        .populate("applicableProducts", "title price")
        .populate("applicableCategories", "name")
        .populate("usedBy.userId", "username email")
  
      const totalOffers = await Offer.countDocuments(filterConditions)
  
      res.status(200).json({ success: true, offers, totalOffers })
    }
    catch (error) {
      console.error("Error listing offers:", error.message)
      next(error)
    }
}
  




module.exports = {createOffer, getAllOffers }
