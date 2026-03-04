const Offer = require('../Models/offerModel')
const Product = require('../Models/productModel') 
const Category = require('../Models/categoryModel')
const cloudinary = require('../Utils/cloudinary')

const {calculateBestOffer, findUserGroup} = require('./controllerUtils/offersAndDiscountsUtils')

const {errorHandler} = require('../Utils/errorHandler') 


const createOffer = async (req, res, next) => {
    try {
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
        let uploadedImage = null
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "offer/image",
                resource_type: "image",
            })
            uploadedImage = {
                public_id: result.public_id,
                name: req.file.originalname,
                url: result.secure_url,
                size: result.bytes,
            }
        }

        if (!name || !discountType || !startDate || !endDate) {
            return next(errorHandler(400, "Required fields are missing!"))
        }

        if (discountType === "percentage" && (!discountValue || discountValue <= 0)) {
            return next(errorHandler(400, "Discount value is missing or invalid!"))
        }

        if (new Date(endDate) <= new Date(startDate)) {
            return next(errorHandler(400, "End date must be after start date!"))
        }

        const existingOffer = await Offer.findOne({ name: name.trim().toUpperCase() })
        if (existingOffer) {
            return next(errorHandler(400, "Offer name already exists!"))
        }

        let categoryIds = []
        if (Array.isArray(applicableCategories) && applicableCategories.length > 0) {
            const categories = await Category.find({ name: { $in: applicableCategories } }, "_id")
            categoryIds = categories.map((cat) => cat._id)
        }

        let productIds = []
        if (Array.isArray(applicableProducts) && applicableProducts.length > 0) {
            const products = await Product.find({ title: { $in: applicableProducts }, variantOf: null }, "_id")
            productIds = products.map((prod) => prod._id)
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
            ...(uploadedImage ? { offerBanner: uploadedImage } : {}),
        })

        await newOffer.save()

        const populatedOffer = await Offer.findById(newOffer._id)
            .populate("applicableProducts", "title price")
            .populate("applicableCategories", "name")

        return res.status(201).json({
            success: true,
            message: "Offer created successfully!",
            offer: populatedOffer,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getAllOffers = async (req, res, next) => {
    try {
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
            status,
            searchData,
            targetUserGroup,
            userId,
        } = queryOptions

        const skip = (page - 1) * limit

        let filterConditions = {}

        if (startDate) filterConditions.startDate = { $gte: new Date(startDate) }
        if (endDate) filterConditions.endDate = { $lte: new Date(endDate) }

        if (discountType && discountType !== "all") {
            filterConditions.discountType = discountType
        }

        if (applicableType && applicableType !== "all") {
            filterConditions.applicableType = applicableType
        }

        if (minimumOrderValue) {
            filterConditions.minimumOrderValue = { $lte: minimumOrderValue }
        }

        if (usedCount) {
            filterConditions.usedCount = { $lte: usedCount }
        }

        if (status && status !== "all") {
            filterConditions.status = status
        }

        if (searchData) {
            filterConditions.name = { $regex: searchData, $options: "i" }
        }

        if (userId) {
            const group = await findUserGroup(userId)
            filterConditions = {
                ...filterConditions,
                $or: [{ targetUserGroup: "all" }, { targetUserGroup: group }],
            }
        } else if (targetUserGroup && targetUserGroup !== "all") {
            filterConditions.targetUserGroup = targetUserGroup
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
            .populate("applicableProducts", "title subtitle price thumbnail variantOf variants")
            .populate("applicableCategories", "name description image")
            .populate("usedBy.userId", "username email")

        const totalOffers = await Offer.countDocuments(filterConditions)

        return res.status(200).json({
            success: true,
            offers,
            totalOffers,
            appliedUserGroup: userId ? await findUserGroup(userId) : targetUserGroup || "all",
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const updateOffer = async (req, res, next) => {
    try {
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
        } = req.body

        let uploadedImage = null
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "offer/image",
                resource_type: "image",
            })
            uploadedImage = {
                public_id: result.public_id,
                name: req.file.originalname,
                url: result.secure_url,
                size: result.bytes,
            }
        }

        if (!offerId) {
            return next(errorHandler(400, "Offer ID is required!"))
        }

        const existingOffer = await Offer.findById(offerId)
        if (!existingOffer) {
            return next(errorHandler(404, "Offer not found!"))
        }

        if (discountType === "percentage" && (!discountValue || discountValue <= 0)) {
            return next(errorHandler(400, "Discount value is missing or invalid!"))
        }

        if (new Date(endDate) <= new Date(startDate)) {
            return next(errorHandler(400, "End date must be after start date!"))
        }

        let categoryIds = []
        if (Array.isArray(applicableCategories) && applicableCategories.length > 0) {
            const categories = await Category.find({ name: { $in: applicableCategories } }, "_id")
            categoryIds = categories.map((cat) => cat._id)
        }

        let productIds = []
        if (Array.isArray(applicableProducts) && applicableProducts.length > 0) {
            const products = await Product.find({ title: { $in: applicableProducts }, variantOf: null }, "_id")
            productIds = products.map((prod) => prod._id)
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
                ...(uploadedImage ? { offerBanner: uploadedImage } : {}),
            },
            { new: true },
        )
        const populatedOffer = await Offer.findById(updatedOffer._id)
            .populate("applicableProducts", "title price")
            .populate("applicableCategories", "name")

        return res.status(201).json({
            success: true,
            message: "Offer created successfully!",
            offer: populatedOffer,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const deleteOffer = async (req, res, next) => {
    try {
        const { offerId } = req.params
        const offer = await Offer.findById(offerId)
        if (!offer) {
            return next(errorHandler(404, "Offer not found!"))
        }

        if (offer.offerBanner && offer.offerBanner.public_id) {
            await cloudinary.uploader.destroy(offer.offerBanner.public_id)
        }

        await Offer.findByIdAndDelete(offerId)

        return res.status(200).json({ success: true, message: "Offer deleted successfully!" })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getBestOffer = async (req, res, next) => {
    try {
        const userId = req?.user?._id || null
        const { productId, quantity } = req.body
        if (!productId || !quantity) {
            return next(errorHandler(400, "Invalid product or quantity!"))
        }

        const product = await Product.findById(productId)
        if (!product) {
            return next(errorHandler(404, "Product not found!"))
        }
        if (product.blocked) {
            return next(errorHandler(403, "This product is currently blocked and cannot be added to the cart."))
        }

        const {
            offerDiscountType,
            bestDiscount,
            maxOfferDiscountApplied,
            offerApplied,
            isBOGO,
            offerDetails,
            offerOrOtherDiscount,
            nonOfferDiscountValue,
        } = await calculateBestOffer(userId, productId, quantity)

        res.status(200).json({
            message: "Found the best offer!",
            offerDiscountType,
            bestDiscount,
            offerApplied,
            isBOGO,
            bestOffer: {
                offerDiscountType,
                bestDiscount,
                maxOfferDiscountApplied,
                offerApplied,
                isBOGO,
                offerDetails,
                offerOrOtherDiscount,
                nonOfferDiscountValue,
            },
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const toggleOfferStatus = async (req, res, next) => {
    try {
        const { offerId } = req.params
        const offer = await Offer.findById(offerId)
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found!" })
        }

        offer.status = offer.status === "active" ? "deactivated" : "active"
        await offer.save()

        return res.status(200).json({
            success: true,
            message: `Offer status changed to '${offer.status}' successfully!`,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const increaseOfferImpression = async (req, res, next) => {
    try {
        const { offerId } = req.params

        if (!offerId) {
            return next(errorHandler(400, "Offer ID is required"))
        }

        const now = new Date()

        const updatedOffer = await Offer.findOneAndUpdate(
            {
                _id: offerId,
                status: "active",
                startDate: { $lte: now },
                endDate: { $gte: now },
            },
            {
                $inc: { impressionCount: 1 },
            },
            {
                new: true,
            },
        )

        if (!updatedOffer) {
            return next(errorHandler(404, "Active offer not found or expired"))
        }

        return res.status(200).json({
            success: true,
            message: "Impression count increased",
            impressionCount: updatedOffer.impressionCount,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


module.exports = {
    createOffer,
    getAllOffers,
    updateOffer,
    deleteOffer,
    getBestOffer,
    toggleOfferStatus,
    increaseOfferImpression,
}
