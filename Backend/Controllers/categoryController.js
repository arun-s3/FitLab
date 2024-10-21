const Category = require('../Models/categoryModel')
const cloudinary = require('../Utils/cloudinary')
const {errorHandler} = require('../Utils/errorHandler')

const packCategoryData = async (req)=>{
    try{
        console.log("req.body-->", JSON.stringify(req.body))
        console.log("req.file-->", JSON.stringify(req.file))
        console.log("Image path:", req.file.path);
        
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
            parentCategory: req.body?.parentCategory, 
            relatedCategory: req.body?.relatedCategory|| [],
            image: uploadedImage,
        } 
        for(field in categoryDatas){
            !categoryDatas[field] && delete categoryDatas[field]
        }
        console.log("Category Name-->" ,categoryDatas.name)
        // console.log("Weights Array?-->" ,Array.isArray(categoryDatas.weights))
        // console.log("Tags Array?-->" ,Array.isArray(categoryDatas.tags))
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
        res.status(201).json({createCategory:'true', category:savedCategory});  
    } 
    catch (error) { 
        console.log("Error in productController-createUser-->"+error.message);
        next(error)
    }
}

module.exports = {createCategory}