const category = require('../Models/categoryModel')
const Category = require('../Models/categoryModel')
const Product = require('../Models/productModel')

const cloudinary = require('../Utils/cloudinary')
const {errorHandler} = require('../Utils/errorHandler')


const packCategoryData = async (req) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "category/image",
            resource_type: "image",
        })
        const uploadedImage = {
            public_id: result.public_id,
            name: req.file.originalname,
            url: result.secure_url,
            size: result.bytes,
        }
        const categoryDatas = {
            name: req.body.categoryName,
            description: req.body.categoryDescription,
            discount: req.body?.categoryDiscount || 0,
            badge: req.body?.categoryBadge && req.body?.categoryBadge !== "null" ? req.body.categoryBadge : null,
            image: uploadedImage,
        }

        if (req.body?.relatedCategory) {
            const relatedCategoryList = req.body.relatedCategory
            let relatedCategory = []
            for (const cat of relatedCategoryList) {
                const categoryDoc = await Category.findOne({ name: cat }, { _id: 1 })
                if (categoryDoc) {
                    relatedCategory.push(categoryDoc._id)
                }
            }
            categoryDatas.relatedCategory = relatedCategory
        }

        const parseDate = (value) => {
            if (!value || value === "null") return null

            const date = new Date(value)
            return isNaN(date.getTime()) ? null : date
        }

        const start = parseDate(req.body.startDate)
        const end = parseDate(req.body.endDate)

        const now = new Date()
        categoryDatas.seasonalActivation = {
            startDate: start,
            endDate: end,
        }
        if (start && end) {
            categoryDatas.isActive = start <= now && end >= now
        } else {
            categoryDatas.isActive = true
        }

        for (field in categoryDatas) {
            !categoryDatas[field] && delete categoryDatas[field]
        }
        return categoryDatas
    } catch (error) {
        console.error(error)
    }
}

const createCategory = async (req, res, next) => {
    try {
        const categoryDatas = await packCategoryData(req)
        const newCategory = new Category(categoryDatas)
        const savedCategory = await newCategory.save()
        if (savedCategory) {
            if (
                req.body.parentCategory !== "null" &&
                req.body.parentCategory !== null &&
                req.body.parentCategory !== "" &&
                req.body.parentCategory !== undefined
            ) {
                const parentCategoryDoc = await Category.findOne({ name: req.body.parentCategory })
                if (parentCategoryDoc) {
                    const updatedCategory = await Category.updateOne(
                        { _id: savedCategory._id },
                        { $set: { parentCategory: parentCategoryDoc._id } },
                    )
                    let updatedParentCategoryDoc
                    if (updatedCategory) {
                        updatedParentCategoryDoc = await Category.updateOne(
                            { _id: parentCategoryDoc._id },
                            { $push: { subCategory: savedCategory._id } },
                        )
                    }
                    if (!updatedParentCategoryDoc) {
                        await Category.deleteOne({ _id: savedCategory._id })
                        next(errorHandler(500, "Internal Server Error!"))
                    }
                } else {
                    next(errorHandler(500, "No such parent category found!"))
                }
                res.status(201).json({ createCategory: "true", category: savedCategory })
            }
            res.status(201).json({ createCategory: "true", category: { ...savedCategory, productCount: 0 } })
        }
    } catch (error) {
        next(error)
        console.error(error)
    }
}

const findCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params
        const category = await Category.findOne({ _id: id })
            .populate("subCategory")
            .populate("parentCategory")
            .populate("relatedCategory")
            .exec()
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }
        const subCategories = category.subCategory

        let parentLevelCount = await findParentLevelCount(subCategories[0]?._id)

        async function findParentLevelCount(subCategoryId, level = 0) {
            if (!subCategoryId) return level
            const subCategory = await Category.findOne({ _id: subCategoryId }).populate("parentCategory").exec()
            return subCategory.parentCategory ? findParentLevelCount(subCategory.parentCategory._id, level + 1) : level
        }
        res.status(200).json({
            success: true,
            category,
            parentName: category.name,
            populatedSubCategories: subCategories,
            parentLevelCount,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const getCategoryIdByName = async (req, res, next) => {
    try {
        const { name } = req.params
        if (!name || !name.trim()) {
            next(errorHandler(400, "Category name is required"))
        }

        const category = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
        }).select("_id name subCategory")

        if (!category) {
            next(errorHandler(404, "Category not found"))
        }
        res.status(200).json({ id: category._id, name: category.name, subCategory: category.subCategory, category })
    } catch (error) {
        console.error("Error fetching category ID:", error)
        next(error)
    }
}

const getAllCategories = async (req, res, next) => {
    try {
        let { status, isActive } = req.query
        let filter = {}
        let categoriesData, categoriesCount

        if (Object.keys(req.query).length > 0) {
            if (status === "active") filter.isBlocked = false
            else if (status === "blocked") filter.isBlocked = true

            if (isActive === "true") filter.isActive = true
            else if (isActive === "false") filter.isActive = false

            categoriesData = await Category.find(filter)
                .populate({
                    path: "relatedCategory",
                    select: "name image isActive isBlocked discount",
                })
                .lean()
            categoriesCount = categoriesData.length
        } else {
            categoriesData = await Category.find({ parentCategory: null })
                .populate({
                    path: "relatedCategory",
                    select: "name image isActive isBlocked discount",
                })
                .lean()
            categoriesCount = categoriesData.length
        }

        if (categoriesData.length === 0) {
            return res.status(200).json({
                success: false,
                categoriesData: [],
                categoriesCount: 0,
                message: "No categories found",
            })
        }

        const categoryNames = categoriesData.map((cat) => cat.name)

        const productCounts = await Product.aggregate([
            {
                $match: {
                    category: { $in: categoryNames },
                },
            },
            {
                $unwind: "$category",
            },
            {
                $match: {
                    category: { $in: categoryNames },
                },
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
        ])

        const countMap = {}
        productCounts.forEach((item) => {
            countMap[item._id] = item.count
        })

        const enrichedCategories = categoriesData.map((cat) => ({
            ...cat,
            productCount: countMap[cat.name] || 0,
        }))

        res.status(200).json({
            success: true,
            categoriesData: enrichedCategories,
            categoriesCount,
        })
    } catch (error) {
        next(error)
        console.error(error)
    }
}

const getFirstLevelCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ parentCategory: null })
        let firstLevelCategories = []
        if (categories.length) {
            firstLevelCategories = await Promise.all(
                categories.map(async (cat) => {
                    if (cat.subCategory) {
                        return await Category.findOne({ _id: cat._id }).populate("subCategory").exec()
                    } else {
                        return cat
                    }
                }),
            )
        }
        if (firstLevelCategories.length) {
            res.status(200).json({ firstLevelCategories })
        } else {
            next(errorHandler(404, "No categories found!"))
        }
    } catch (error) {
        next(error)
        console.error(error)
    }
}

const getCategoryNames = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!category) {
            return next(errorHandler(404, "No such category available!"))
        }
        const parentCategoryName = category.parentCategory?.name || null
        const relatedCategoryNames = category.relatedCategory?.map((cat) => cat?.name || null) || []
        res.status(200).json({ categoryDatas: { parentCategoryName, relatedCategoryNames } })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const getNestedSubcategoryNames = async (req, res, next) => {
    try {
        const { id } = req.params
        let subcategoryNames = []
        let parentLevelCounts = []

        async function findParentLevelCount(subCategoryId, level = 0) {
            if (!subCategoryId) return level
            const subCategory = await Category.findOne({ _id: subCategoryId }).populate("parentCategory").exec()
            return subCategory.parentCategory ? findParentLevelCount(subCategory.parentCategory._id, level + 1) : level
        }

        const findSubcategoryNames = async (id) => {
            const category = await Category.findOne(
                { _id: id },
                { _id: 1, name: 1, badge: 1, parentCategory: 1, subCategory: 1 },
            )
            if (category) {
                let parentLevelCount = await findParentLevelCount(category._id)
                subcategoryNames.push({
                    _id: category._id,
                    name: category.name,
                    badge: category.badge,
                    parentCategory: category.parentCategory,
                    subCategory: category.subCategory,
                    parentLevelCount,
                })
                // parentLevelCounts.push(parentLevelCount)
                if (category.subCategory && category.subCategory.length) {
                    await Promise.all(
                        category.subCategory.map(async (cat) => {
                            await findSubcategoryNames(cat._id)
                        }),
                    )
                }
            }
        }
        await findSubcategoryNames(id)
        res.status(200).json({ nestedSubcategoryNames: subcategoryNames })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const getDiscountedCategoriesByNames = async (req, res, next) => {
    try {
        const { names } = req.body
        if (!Array.isArray(names) || names.length === 0) {
            return next(errorHandler(400, "Category names array is required"))
        }

        const now = new Date()

        const categories = await Category.find({
            name: { $in: names },
            discount: { $gt: 0 },
            isActive: true,
            isBlocked: false,
        }).select("name discount")

        const discountedCategoryNames = categories.map((cat) => cat.name)
        res.status(200).json({ discountedCategories: discountedCategoryNames })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const toggleCategoryStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        let status, newStatus
        const blockStatusIdList = []

        const category = await Category.findOne({ _id: id })
        status = category.isBlocked
        const statusToggler = async (id) => {
            const category = await Category.findOne({ _id: id })

            const returnedCategory = await Category.findOneAndUpdate(
                { _id: id },
                { $set: { isBlocked: !status } },
                { new: true },
            )
            if (returnedCategory) {
                newStatus = returnedCategory.isBlocked
                blockStatusIdList.push({
                    id: returnedCategory._id,
                    name: returnedCategory.name,
                    status: newStatus,
                    parentCategory: returnedCategory.parentCategory,
                })
                if (returnedCategory.subCategory && returnedCategory.subCategory.length > 0) {
                    for (const id of returnedCategory.subCategory) {
                        await statusToggler(id)
                    }
                }
            }
        }

        await statusToggler(id)
        res.status(200).json({
            blockStatusIdList,
            message: newStatus ? "Blocked successfully!" : "Unblocked successfully!",
        })
    } catch (error) {
        next(error)
        console.error(error)
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        const category = await Category.findOne({ _id: id })
        let parentCategoryDoc
        if (category) {
            const categoryDatas = await packCategoryData(req)
            if (
                req.body.parentCategory !== "null" &&
                req.body.parentCategory !== null &&
                req.body.parentCategory !== "" &&
                req.body.parentCategory !== undefined
            ) {
                parentCategoryDoc = await Category.findOne({ name: req.body.parentCategory })
                if (parentCategoryDoc) {
                    const updatedCategory = await Category.updateOne(
                        { _id: id },
                        { $set: { ...categoryDatas, parentCategory: parentCategoryDoc._id } },
                    )
                    let updatedParentCategoryDoc
                    if (updatedCategory) {
                        updatedParentCategoryDoc = await Category.updateOne(
                            { _id: parentCategoryDoc._id },
                            { $push: { subCategory: id } },
                        )
                    }
                    if (!updatedParentCategoryDoc) {
                        await Category.deleteOne({ _id: updatedCategory._id })
                        next(errorHandler(500, "Internal Server Error!"))
                    }
                } else {
                    next(errorHandler(500, "No such parent category found!"))
                }
                res.status(200).json({
                    updatedCategory: true,
                    category: {
                        ...categoryDatas,
                        ...(parentCategoryDoc ? { parentCategory: parentCategoryDoc._id } : {}),
                    },
                })
            } else {
                await Category.updateOne({ _id: id }, { $set: categoryDatas })

                const updatedCategoryDoc = await Category.findById(id).lean()

                const productCount = await Product.countDocuments({
                    category: updatedCategoryDoc.name,
                })
                return res.status(200).json({
                    updatedCategory: true,
                    category: {
                        ...updatedCategoryDoc,
                        productCount,
                    },
                })
            }
            res.status(200).json({
                updatedCategory: true,
                category: {
                    ...categoryDatas,
                    productCount,
                    ...(parentCategoryDoc ? { parentCategory: parentCategoryDoc._id } : {}),
                },
            })
        } else {
            next(errorHandler(400, "No such category available to update"))
        }
    } catch (error) {
        next(error)
        console.error(error)
    }
}

const countProductsByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params
        if (!categoryId) return next(errorHandler(400, "Category ID is required!"))

        const category = await Category.findById(categoryId)
        if (!category) return next(errorHandler(404, "Category not found!"))

        const getAllSubcategoryNames = async (categoryId, collected = []) => {
            const category = await Category.findById(categoryId)
            if (!category) return collected

            collected.push(category.name)

            for (const subId of category.subCategory) {
                await getAllSubcategoryNames(subId, collected)
            }

            return collected
        }

        const allCategoryNames = await getAllSubcategoryNames(categoryId)
        const count = await Product.countDocuments({
            category: { $in: allCategoryNames },
        })
        return res.status(200).json({
            success: true,
            categoriesIncluded: allCategoryNames,
            productCount: count,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const searchCategoryByName = async (req, res, next) => {
    try {
        const { name } = req.query
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required for search",
            })
        }

        const categoriesData = await Category.find({
            name: { $regex: name.trim(), $options: "i" },
        })

        const categoriesCount = categoriesData.length

        if (categoriesCount > 0) {
            res.status(200).json({
                success: true,
                categoriesData,
                categoriesCount,
            })
        } else {
            res.status(200).json({
                success: false,
                categoriesData: [],
                categoriesCount: 0,
                message: "No matching categories found",
            })
        }
    } catch (error) {
        next(error)
        console.error(error)
    }
}



module.exports = {
    createCategory,
    getAllCategories,
    getFirstLevelCategories,
    findCategoryById,
    getCategoryIdByName,
    searchCategoryByName,
    getCategoryNames,
    getNestedSubcategoryNames,
    getDiscountedCategoriesByNames,
    toggleCategoryStatus,
    updateCategory,
    countProductsByCategory,
}