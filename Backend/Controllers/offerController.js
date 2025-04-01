const Offer = require('../Models/offerModel')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel') 
const Category = require('../Models/categoryModel')
const User = require('../Models/userModel')
const cloudinary = require('../Utils/cloudinary')

const {calculateBestOffer} = require('./controllerUtils/offersAndDiscountsUtils')
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
            name: name,
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
            ...(uploadedImage ? { offerBanner: uploadedImage } : {})
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
        const {
          page = 1,
          limit = 6,
          startDate,
          endDate,
          sort = -1,
          sortBy = "createdAt",
          discountType, 
          applicableType,
          minimumOrderValue,
          usedCount,
          searchData 
        } = queryOptions

        const skip = (page - 1) * limit
        console.log("queryOptions--->", JSON.stringify(queryOptions))

        let filterConditions = {}
        if (startDate){
            filterConditions.startDate = { $gte: new Date(startDate) }
        }
        if (endDate){
            filterConditions.endDate = { $lte: new Date(endDate) }
        }   
        if (discountType && discountType !== 'all'){
            filterConditions.discountType = discountType
        }   
        if (applicableType && applicableType !== 'all'){
            filterConditions.applicableType = applicableType
        }

        if (minimumOrderValue){
            filterConditions.minimumOrderValue = { $lte: minimumOrderValue }
        }

        if (usedCount){
            filterConditions.usedCount = { $lte: usedCount }
        }

        if (searchData){
            filterConditions.name = { $regex: searchData, $options: "i" }
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
  

const updateOffer = async (req, res, next)=> {
    try {
        console.log("Inside updateOffer of offerController")
        console.log("req.body.offerDetails", JSON.stringify(req.body))

        const { offerId } = req.params
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
        } = req.body.offerDetails

        console.log(`Updating offer: ${offerId}`)

        let uploadedImage = null
        if (req.file) {
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

        if (!offerId) {
            return next(errorHandler(400, "Offer ID is required!"))
        }

        const existingOffer = await Offer.findById(offerId)
        if (!existingOffer) {
            return next(errorHandler(404, "Offer not found!"))
        }

        if (discountType === 'percentage' && (!discountValue || discountValue <= 0)) {
            return next(errorHandler(400, "Discount value is missing or invalid!"))
        }

        if (new Date(endDate) <= new Date(startDate)) {
            return next(errorHandler(400, "End date must be after start date!"))
        }

        let categoryIds = []
        if (Array.isArray(applicableCategories) && applicableCategories.length > 0) {
            const categories = await Category.find({ name: { $in: applicableCategories } }, "_id")
            categoryIds = categories.map(cat => cat._id)
        }

        let productIds = []
        if (Array.isArray(applicableProducts) && applicableProducts.length > 0) {
            const products = await Product.find({ title: { $in: applicableProducts } }, "_id")
            productIds = products.map(prod => prod._id)
        }

        const updatedOffer = await Offer.findByIdAndUpdate(
            offerId,
            {
                name,
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
                ...(uploadedImage ? { offerBanner: uploadedImage } : {})
            },
            {new: true}
        )

        console.log("updatedOffer--->", updatedOffer)

        return res.status(200).json({ success: true, message: "Offer updated successfully!", offer: updatedOffer })
    }
    catch(error){
        console.error("Error updating offer:", error.message)
        next(error)
    }
}


const deleteOffer = async (req, res, next)=> {
    try {
        console.log("Inside deleteOffer of offerController")

        const { offerId } = req.params
        console.log("Offer ID to delete:", offerId)

        const offer = await Offer.findById(offerId)
        if (!offer){
            return next(errorHandler(404, "Offer not found!"))
        }

        if (offer.offerBanner && offer.offerBanner.public_id){
            console.log("Deleting offer banner from Cloudinary:", offer.offerBanner.public_id)
            await cloudinary.uploader.destroy(offer.offerBanner.public_id)
        }

        await Offer.findByIdAndDelete(offerId);

        return res.status(200).json({ success: true, message: "Offer deleted successfully!" })
    }
    catch(error){
        console.error("Error deleting offer:", error.message)
        next(error)
    }
}


const getBestOffer = async (req, res, next)=> {
    try{
        console.log("Inside getBestOffer of offerController")
        console.log("req.user--->", JSON.stringify(req.user))

        const userId = req.user._id
        const {productId, quantity} = req.body

        console.log(`productId-----> ${productId}...quantity-----> ${quantity}`)

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

        const {offerDiscountType, bestDiscount, offerApplied, isBOGO, offerDetails} = await calculateBestOffer(userId, productId, quantity) 

        res.status(200).json({
            message: "Found the best offer!", offerDiscountType, bestDiscount, offerApplied, isBOGO,
            bestOffer: {
                offerDiscountType, bestDiscount, offerApplied, isBOGO, offerDetails
            }
        })
    }
    catch(error){
        console.error("Error getting best offer:", error.message)
        next(error) 
    }
}




module.exports = {createOffer, getAllOffers, updateOffer, deleteOffer, getBestOffer }
