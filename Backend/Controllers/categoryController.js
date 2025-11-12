const category = require('../Models/categoryModel')
const Category = require('../Models/categoryModel')
const cloudinary = require('../Utils/cloudinary')
const {errorHandler} = require('../Utils/errorHandler')

const packCategoryData = async (req)=>{
    try{
        console.log("req.body-->", JSON.stringify(req.body))
        console.log("req.file-->", JSON.stringify(req.file))
        console.log("Image path:", req.file.path);
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'category/image',
            resource_type: 'image',
        })
        const uploadedImage = {
            public_id: result.public_id,
            name: req.file.originalname,
            url: result.secure_url,
            size: result.bytes,
        }
        console.log("uploadedImages-->", JSON.stringify(uploadedImage))

        const categoryDatas = {
            name: req.body.categoryName, 
            description: req.body.categoryDescription, 
            discount: req.body?.categoryDiscount, 
            badge: req.body?.categoryBadge,   
            // parentCategory: req.body?.parentCategory, 
            // relatedCategory: req.body?.relatedCategory|| [],
            image: uploadedImage,
        } 

        if(req.body?.relatedCategory){
            const relatedCategoryList = req.body.relatedCategory
            let relatedCategory = []
            for (const cat of relatedCategoryList) {
                const categoryDoc = await Category.findOne({name: cat}, {_id: 1})
                if (categoryDoc) {
                    relatedCategory.push(categoryDoc._id)
                }
            }
            console.log("relatedCategory[]-->", relatedCategory)
            categoryDatas.relatedCategory = relatedCategory
            console.log("categoryDatas.relatedCategory-->", JSON.stringify(categoryDatas.relatedCategory))
        }

        if (req.body?.startDate || req.body?.endDate) {             
            const now = new Date()
            const start = new Date(req.body.startDate)
            const end = new Date(req.body.endDate)
        
            categoryDatas.seasonalActivation = { startDate: start, endDate: end }
            categoryDatas.isActive = start <= now && end >= now
        }

        for(field in categoryDatas){
            !categoryDatas[field] && delete categoryDatas[field]
        }
        console.log("Category Name-->" ,categoryDatas.name)
        console.log("categoryDatas--->", JSON.stringify(categoryDatas))

        return categoryDatas
    }
    catch(error){
        console.log("Error in packCategoryData function-->"+error.message);
    }
}

const createCategory = async(req,res,next)=>{
    try {
        console.log("Inside createCategory controller, received categoryForm-->", JSON.stringify(req.body.categoryName))
        const categoryDatas = await packCategoryData(req)
        const newCategory = new Category(categoryDatas)
        const savedCategory = await newCategory.save();
        if(savedCategory){
            if(req.body.parentCategory !== 'null' && req.body.parentCategory !== null && req.body.parentCategory !== '' && req.body.parentCategory !== undefined){
                const parentCategoryDoc = await Category.findOne({name: req.body.parentCategory})
                if(parentCategoryDoc){
                    console.log("Putting up Subcategory field")
                    const updatedCategory = await Category.updateOne({_id: savedCategory._id},{$set: {parentCategory: parentCategoryDoc._id}})
                    let updatedParentCategoryDoc
                    if(updatedCategory){
                        updatedParentCategoryDoc = await Category.updateOne({_id: parentCategoryDoc._id}, {$push: {subCategory: savedCategory._id}})
                    }
                    if(!updatedParentCategoryDoc){
                        await Category.deleteOne({_id: savedCategory._id})
                        next(errorHandler(500, "Internal Server Error!"))
                    }
                }else{
                    next(errorHandler(500, "No such parent category found!"))
                }
            }
        }
        res.status(201).json({createCategory:'true', category:savedCategory});  
    } 
    catch (error) { 
        console.log("Error in categoryController-createCategory-->"+error.message);
        next(error)
    }
}

const findCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("id-->", id);

        console.log("Inside findCategoryById controller...")

        const category = await Category.findOne({ _id: id })
            .populate('subCategory').populate('parentCategory').populate('relatedCategory').exec();

        console.log("\n\n" + "CATEGORY NAME FROM BACKEND---->", category.name)
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        const subCategories = category.subCategory;

        let parentLevelCount = await findParentLevelCount(subCategories[0]?._id);

        async function findParentLevelCount(subCategoryId, level = 0) {
            if (!subCategoryId) return level;
            const subCategory = await Category.findOne({ _id: subCategoryId }).populate('parentCategory').exec();
            return subCategory.parentCategory ? findParentLevelCount(subCategory.parentCategory._id, level + 1) : level;
        }
        console.log("Sending populatedSubcategories-->", JSON.stringify({ success: true, populatedSubCategories: subCategories, parentName: category.name, parentLevelCount }));
        res.status(200).json({ success: true, category, parentName: category.name, populatedSubCategories: subCategories, parentLevelCount });
    } catch (error) {
        console.error('Error in categoryController findCategoryById--->', error.message);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
}


const getCategoryIdByName = async (req, res, next)=> {
  try {
    const {name} = req.params
    console.log("Inside getCategoryIdByName, received category name-->", name)

    if (!name || !name.trim()) {
      next(errorHandler(400, "Category name is required"))
    }

    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }}).select("_id name subCategory")

    if (!category) {
      next(errorHandler(404, "Category not found"))
    }

    console.log("Required category id----->", category._id)
    res.status(200).json({id: category._id, name: category.name, subCategory: category.subCategory})
  }
  catch (error) {
    console.error("Error fetching category ID:", error);
    next(error)
  }
}


const getAllCategories = async (req, res, next) => {
  try {
    console.log("Inside getAllCategories")
    console.log("req.query -->", JSON.stringify(req.query))

    let { status, isActive } = req.query
    let filter = {}
    let categoriesData, categoriesCount

    if (Object.keys(req.query).length > 0) {
      console.log("Inside if of getAllCategories")

      if (status === "active") filter.isBlocked = false
      else if (status === "blocked") filter.isBlocked = true

      if (isActive === "true") filter.isActive = true
      else if (isActive === "false") filter.isActive = false

      console.log("Final filter -->", JSON.stringify(filter))

      categoriesData = await Category.find(filter)
      categoriesCount = categoriesData.length
    } 
    else {
      console.log("Inside else of getAllCategories")
      categoriesData = await Category.find({ parentCategory: null })
      categoriesCount = await Category.countDocuments({ parentCategory: null })
    }

    if (categoriesData.length > 0) {
      console.log("categoriesData to frontend -->", JSON.stringify(categoriesData.map(cat=> cat.name)))
      res.status(200).json({ success: true, categoriesData, categoriesCount })
    } else {
      res.status(404).json({success: false, categoriesData: [], categoriesCount: 0, message: "No categories found"})
    }
  }
  catch (error) {
    console.log("Error in categoryController getAllCategories --> " + error.message)
    next(error)
  }
}


// const getEveryCategoryNames = async(req,res,next)=> {
//     try{
//         console.log("Inside getEveryCategories of categoryController")
//         const everyCategoryNames = await Category.find({},{name:1})
//         if (!everyCategoryNames.length) {
//             next(errorHandler(404, "No categories found!"))
//         }
//         if(everyCategoryNames){
//             console.log("Every category names---->", JSON.stringify(everyCategoryNames))
//             res.status(200).json({everyCategoryNames})
//         }
//     }
//     catch(error){
//         console.log("Error in categoryController getEveryCategories-->"+ error.message)
//         next(error)
//     }
// }

const getFirstLevelCategories = async(req,res,next)=> {
    try{
        console.log("Inside getFirstLevelCategories of categoryController")
        const categories = await Category.find({parentCategory: null})
        console.log("Toppest level categories found in getFirstLevelCategories---->", JSON.stringify(categories))
        let firstLevelCategories = []
        if(categories.length){
            firstLevelCategories = await Promise.all(
                categories.map( async (cat)=> {
                    if(cat.subCategory){
                        return await Category.findOne({_id: cat._id}).populate('subCategory').exec()
                    }else{
                        return cat
                    }
                })
            )
        }
        if(firstLevelCategories.length){
            console.log("firstLevelCategories from getFirstLevelCategories--->", JSON.stringify(firstLevelCategories))
            res.status(200).json({firstLevelCategories})
        }else{
            next(errorHandler(404, "No categories found!"))
        }
    }
    catch(error){
        console.log("Error in categoryController getFirstLevelCategories-->"+ error.message)
        next(error)
    }
}
// const getCategoriesOfType = async (req, res, next) => {
//     try {
//         let {status} = req.query;
//         let categoriesData, categoriesCount

//         if (status !== 'all') {
//             status = status === 'active' ? false : true
//             categoriesData = await Category.find({isBlocked: status})
//         } else {
//             categoriesData = await Category.find({})
//         }
//         categoriesCount = categoriesData.length
//         if (categoriesData.length > 0) {
//             res.status(200).json({ success: true, categoriesData, categoriesCount })
//         } else {
//             res.status(404).json({ success: false, categoriesData, categoriesCount, message: "No categories found" })
//         }
//     } catch (error) {
//         console.log("Error in categoryController getCategoriesOfType --> " + error.message)
//         next(error)
//     }
// }

const getCategoryNames = async (req, res, next) => {
    try {
        const {id} = req.params    
        if (!category) {
            return next(errorHandler(404, "No such category available!"))
        }
        const parentCategoryName = category.parentCategory?.name || null
        const relatedCategoryNames = category.relatedCategory?.map(cat => cat?.name || null) || []
        res.status(200).json({categoryDatas:{parentCategoryName, relatedCategoryNames}})
    } catch (error) {
        console.error("Error in categoryController getCategoryNames -->", error.message)
        next(error)
    }
}

const getNestedSubcategoryNames = async (req, res, next) => {
    try {
        const { id } = req.params;
        let subcategoryNames = []  
        let parentLevelCounts = []

        async function findParentLevelCount(subCategoryId, level = 0) {
            if (!subCategoryId) return level;
            const subCategory = await Category.findOne({ _id: subCategoryId }).populate('parentCategory').exec();
            return subCategory.parentCategory ? findParentLevelCount(subCategory.parentCategory._id, level + 1) : level;
        }

        const findSubcategoryNames = async (id) => {
            const category = await Category.findOne({_id: id},{_id:1, name:1, badge:1, parentCategory:1, subCategory:1});
            if (category) {
                let parentLevelCount = await findParentLevelCount(category._id);
                subcategoryNames.push({_id:category._id, name: category.name, badge: category.badge, parentCategory: category.parentCategory, subCategory: category.subCategory, parentLevelCount})
                // parentLevelCounts.push(parentLevelCount)
                if (category.subCategory && category.subCategory.length) {
                    await Promise.all(category.subCategory.map(async (cat) => {
                        await findSubcategoryNames(cat._id);
                    }))
                }
            }
        }
        await findSubcategoryNames(id)
        console.log("nestedSubcategoryNames from backend-->", JSON.stringify(subcategoryNames))
        res.status(200).json({nestedSubcategoryNames: subcategoryNames})
    } catch (error) {
        console.error("Error in categoryController getNestedSubcategoryNames -->", error.message)
        next(error)
    }
}

// const getNestedSubcategoryNames = async (req, res, next) => {
//     try {
//       const { id } = req.params;
//       const subcategoryNames = [];
  
//       const findParentLevelCount = async (subCategoryId, level = 0) => {
//         if (!subCategoryId) return level;
//         const subCategory = await Category.findOne({ _id: subCategoryId }).populate('parentCategory');
//         return subCategory.parentCategory ? findParentLevelCount(subCategory.parentCategory._id, level + 1) : level;
//       };
  
//       const findSubcategoryNames = async (id) => {
//         const category = await Category.findOne({ _id: id }).populate('subCategory');
//         if (category) {
//           const parentLevelCount = await findParentLevelCount(category._id);
//           subcategoryNames.push({
//             _id: category._id,
//             name: category.name,
//             badge: category.badge,
//             parentCategory: category.parentCategory,
//             subCategory: category.subCategory,
//             parentLevelCount,
//           });
  
//           for (const sub of category.subCategory) {
//             await findSubcategoryNames(sub._id);
//           }
//         }
//       };
  
//       await findSubcategoryNames(id);
//       res.status(200).json({ nestedSubcategoryNames: subcategoryNames });
//     } catch (error) {
//       next(error);
//     }
//   };
  

// const findCategoryTreeById = async (req,res,next) => {      // --IMPLEMENT THIS--
//     try {
//         const {id} = req.query;
//         const categoryTree = await buildCategoryTree(id)
//         res.status(200).json({ success: true, categoryTree })
//     } catch (error) {
//         console.log('Error fetching category hierarchy:', error.message)
//         next(error)
//     }
// }

// async function buildCategoryTree(id) {
//     const category = await Category.findById(id).populate('subCategory').exec()
    
//     if (!category) return null
//     const categoryNode = {
//         _id: category._id,
//         name: category.name,
//         subCategory: []
//     }
//     for (const subcat of category.subCategory) {
//         const subCategoryTree = await buildCategoryTree(subcat._id)
//         categoryNode.subCategory.push(subCategoryTree || subcat)
//     }

//     return categoryNode
// }

// const toggleCategoryStatus = async(req,res,next)=>{
//     try{
//         console.log("Inside toggleCategoryStatus controller--")
//         const {id} = req.params
//         console.log("ID-->", id)
//         const category = await Category.findOne({_id:id},{password:0})
//         if (!category) {
//             return next(errorHandler(404, "No such category found!"));
//         }
//         const status = category.isBlocked
//         console.log("Blocked status before-->", status)
//         const returnedCategory = await Category.findOneAndUpdate({_id:id},{$set: {isBlocked: !status}}, {new: true})
//         if(returnedCategory){
//             const status = returnedCategory.isBlocked? 'Blocked' : 'Unblocked'
//             console.log("Blocked status now-->", status)
//             res.status(200).json({categoryBlocked: status, categoryId:id})
//         }
//         else{
//             next(errorHandler(400, "No such category available to update status!"))
//         }
//     }
//     catch(error){
//         console.log("Error in toggleCategoryStatus controller-->", error.message)
//     }
// }

const toggleCategoryStatus = async(req,res,next)=>{
    try{
        console.log("Inside toggleCategoryStatus controller--")
        const {id} = req.params
        console.log("ID-->", id)
        let status, newStatus
        const blockStatusIdList = []

        const category = await Category.findOne({_id:id})
        status = category.isBlocked
        console.log("Blocked status before-->", status)

        const statusToggler = async (id)=> {
            const category = await Category.findOne({_id:id})
            // if (!category) {
            //     return next(errorHandler(404, "No such category found!"));
            // }
            const returnedCategory = await Category.findOneAndUpdate({_id:id},{$set: {isBlocked: !status}}, {new: true})
            if(returnedCategory){
                newStatus = returnedCategory.isBlocked
                console.log("Blocked status now-->", newStatus)
                blockStatusIdList.push({id: returnedCategory._id, name: returnedCategory.name, status: newStatus, parentCategory:returnedCategory.parentCategory})
                if(returnedCategory.subCategory  && returnedCategory.subCategory.length > 0){
                    for (const id of returnedCategory.subCategory) {
                        await statusToggler(id);
                      }
                }
            }
            // else{
            //     next(errorHandler(400, "No such category available to update status!"))
            // }
        }

        await statusToggler(id)
        console.log("BLOCKSTATUSLIST-------->",JSON.stringify(blockStatusIdList))
        res.status(200).json({blockStatusIdList, message: newStatus? 'Blocked successfully!' : 'Unblocked successfully!'})
    }
    catch(error){
        console.log("Error in toggleCategoryStatus controller-->", error.message)
    }
}

const updateCategory = async (req, res, next) => {    
    try {
        console.log("Inside updateCategory of categoryController--")
        const {id} = req.params;
        console.log("Id from params-->",id)
        const category = await Category.findOne({_id: id})
        let parentCategoryDoc
        if(category){
            const categoryDatas = await packCategoryData(req)
            console.log("req.body.parentCategory before If condn-->", req.body.parentCategory)
            // const parentCategory = req.body?.parentCategory ?? false
            if(req.body.parentCategory !== 'null' && req.body.parentCategory !== null && req.body.parentCategory !== '' && req.body.parentCategory !== undefined){
                console.log("req.body.parentCategory-->", req.body.parentCategory)
                parentCategoryDoc = await Category.findOne({name: req.body.parentCategory})
                if(parentCategoryDoc){
                    console.log("Putting up Subcategory field")
                    const updatedCategory = await Category.updateOne({_id: id},{$set: {...categoryDatas, parentCategory: parentCategoryDoc._id}})
                    let updatedParentCategoryDoc
                    if(updatedCategory){
                        updatedParentCategoryDoc = await Category.updateOne({_id: parentCategoryDoc._id}, {$push: {subCategory: savedCategory._id}})
                    }
                    if(!updatedParentCategoryDoc){
                        await Category.deleteOne({_id: updatedCategory._id})
                        next(errorHandler(500, "Internal Server Error!"))
                    }
                }else{
                    next(errorHandler(500, "No such parent category found!"))
                }
            }else{
                console.log("Updating without parentCategory")
                const updatedCategory = await Category.updateOne({_id: id},{$set: categoryDatas})
            }
            res.status(200).json({
                updatedCategory: true,
                category: {...categoryDatas, ...(parentCategoryDoc ? { parentCategory: parentCategoryDoc._id } : {})
                }})
        }
       else{
        next(errorHandler(400, "No such category available to update"))
       }       
    } catch (error) {
        console.log("Error in categoryController-updateCategory-->"+error.message);
        next(error)
    }
  }


module.exports = {createCategory, getAllCategories, getFirstLevelCategories, findCategoryById, getCategoryIdByName,
            getCategoryNames, getNestedSubcategoryNames, toggleCategoryStatus, updateCategory}