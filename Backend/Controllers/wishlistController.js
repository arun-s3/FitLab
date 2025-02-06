const Wishlist = require('../Models/wishlistModel')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
const {errorHandler} = require('../Utils/errorHandler') 



const createList = async (req, res, next)=> {
  try { 
        console.log("Inside createList of wishlistController")
        const {name, description, isPublic, sharedWith, reminderDate, expiryDate, priority} = req.body.wishlistDetails
        const userId = req.user.id

        if (!name){
          return next(errorHandler(400, "List name is required!"))
        }

        let wishlist = await Wishlist.findOne({userId})
        if (!wishlist){
          wishlist = new Wishlist({userId, lists: [] })
        }
        const existingList = wishlist.lists.find(list=> list.name.toLowerCase() === name.toLowerCase())
        if (existingList) {
          return next(errorHandler(400, "List name already exists!"))
        }

        const newList = {
          name,
          description,
          isPublic: isPublic || false,
          sharedWith: sharedWith || [],
          reminderDate: reminderDate || '',
          expiryDate: expiryDate || '',
          priority: priority || 2,
          products: [],
          createdAt: new Date()
        }

        wishlist.lists.push(newList)
        await wishlist.save();
        return res.status(201).json({ success: true, message: "List created successfully", wishlist})
  }
  catch(error){
    console.error("Error creating wishlist:", error.message)
    next(error)
  }
}


const addProductToList = async (req, res, next)=> {
  try {
    console.log("Inside addProductToList Controller")
    const { listName, productId, productNote } = req.body
    const userId = req.user.id
    console.log(`userId--->${userId}, productId----> ${productId}, listName----> ${listName}, productNote----> ${productNote}`)

    if (!productId){
      return next(errorHandler(400, "Product ID is required!"))
    }
    const productExists = await Product.findById(productId)
    if (!productExists) {
      return next(errorHandler(404, "Product not found!"))
    }

    let wishlist = await Wishlist.findOne({userId})
    if (!wishlist) {
      wishlist = new Wishlist({ userId, lists: [] })
    }

    const targetListName = listName || "Default Shopping List"
    console.log("targetListName--->", targetListName)

    const listIndex = wishlist.lists.findIndex((list)=> list.name === targetListName)
    console.log("listIndex--->", listIndex)

    if (listIndex !== -1){
      const productAlreadyExists = wishlist.lists[listIndex].products.includes(productId)
      if(productAlreadyExists){
        return next(errorHandler(400, "Product already exists in this wishlist!"))
      }
      wishlist.lists[listIndex].products.push({ product: productId, notes: productNote })
    }else{
      wishlist.lists.push({ name: targetListName, products: [{ product: productId, notes: productNote }] })
    }

    console.log("Wishlist now-->", wishlist)

    await wishlist.save()
    res.status(200).json({message: "Product added to wishlist."})
  } 
  catch(error){
    console.error("Error in addProductToList Controller:", error.message)
    next(error)
  }
}


const removeProductFromList = async (req, res, next)=> {
  try {
    console.log("Inside removeProductFromList Controller")
    const {listName, productId} = req.body
    const userId = req.user.id
    console.log(`userId--->${userId}, productId----> ${productId}, listName----> ${listName}`)

    if (!productId) {
      return next(errorHandler(400, "Product ID is required!"))
    }

    let wishlist = await Wishlist.findOne({userId})
    if (!wishlist){
      return next(errorHandler(404, "Wishlist not found!"))
    }

    const targetListName = listName || "Default Shopping List"
    console.log("targetListName--->", targetListName)

    const listIndex = wishlist.lists.findIndex((list)=> list.name === targetListName)
    console.log("listIndex--->", listIndex)

    if (listIndex === -1){
      return next(errorHandler(404, "Wishlist list not found!"))
    }
    const productIndex = wishlist.lists[listIndex].products.findIndex((p)=> p.product.toString() === productId)
    if (productIndex === -1) {
      return next(errorHandler(404, "Product not found in the specified wishlist!"))
    }

    wishlist.lists[listIndex].products.splice(productIndex, 1)

    console.log("Wishlist now-->", wishlist)

    await wishlist.save()
    res.status(200).json({message: "Product removed from wishlist successfully."})
  } catch (error) {
    console.error("Error in removeProductFromList Controller:", error.message)
    next(error)
  }
}


const getUserWishlist = async(req, res, next)=> {
  try {
    console.log("Inside getUserWishlist Controller")
    const userId = req.user.id

    const wishlist = await Wishlist.findOne({userId})

    if (!wishlist){
      return res.status(200).json({ message: "No wishlist found for this user.", wishlist: {} })
    }

    res.status(200).json({ message: "Wishlist retrieved successfully", wishlist})
  }
  catch(error){
    console.error("Error in getUserWishlist Controller:", error.message)
    next(error)
  }
}



module.exports = {createList, addProductToList, removeProductFromList, getUserWishlist}