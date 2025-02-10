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
          thumbnail: '/placeholder.svg',
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
    const { listName, productId, productNote = '', productPriority = 2 } = req.body
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
      wishlist.lists[listIndex].products.push({ product: productId, notes: productNote, productPriority })
    }else{
      wishlist.lists.push({ name: targetListName, thumbnail: productExists.thumbnail.url, products: [
        { product: productId, notes: productNote, productPriority }
      ] })
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


const getAllWishlistProducts = async (req, res, next)=> {
  try {
    console.log("Inside getAllWishlistProducts controller")
    const { queryOptions } = req.body
    const userId = req.user.id
    console.log("queryOptions:", JSON.stringify(queryOptions))

    let wishlist = await Wishlist.findOne({ userId: userId }).populate("lists.products.product")
    if (!wishlist){
      console.log("No wishlist available!")
      return res.status(200).json({ wishlistProducts: [], productCounts: 0 })
    }

    let productsArray = []
    if (queryOptions?.listName){
      const targetList = wishlist.lists.find((list)=> list.name === queryOptions.listName)
      if (targetList){
        // return res.status(404).json({ message: "List not found!", wishlistProducts: [], productCounts: 0 })
        productsArray = targetList.products
      }
    }else{
      wishlist.lists.forEach((list) => {
        productsArray = productsArray.concat(list.products)
      })
    }
    console.log("productsArray-->", productsArray)

    if (queryOptions?.searchData){
      const searchQuery = queryOptions.searchData.toLowerCase()
      productsArray = productsArray.filter((item)=> {
        const title = item.product?.title?.toLowerCase() || ""
        const subtitle = item.product?.subtitle?.toLowerCase() || ""
        return title.includes(searchQuery) || subtitle.includes(searchQuery)
      })
    }

    if (queryOptions?.sort && Object.keys(queryOptions?.sort).length > 0) {
      const sortKey = Object.keys(queryOptions.sort)[0]
      const sortOrder = Number(queryOptions.sort[sortKey])
      console.log(`Sorting by ${sortKey} in order ${sortOrder}`)

      if (sortKey === "price") {
        productsArray.sort((a, b) => {
          const priceA = a.product?.price || 0
          const priceB = b.product?.price || 0
          return sortOrder * (priceA - priceB)
        })
      }else if (sortKey === "addedAt") {
        productsArray.sort((a, b) => {
          const dateA = new Date(a.addedAt)
          const dateB = new Date(b.addedAt)
          return sortOrder * (dateA - dateB)
        })
      } else if (sortKey === "alphabetical") {
        productsArray.sort((a, b) => {
          const titleA = a.product?.title?.toLowerCase() || ""
          const titleB = b.product?.title?.toLowerCase() || ""
          return sortOrder * titleA.localeCompare(titleB)
        })
      } else if (sortKey === "priority") {
        productsArray.sort((a, b)=> {
          const priorityA = a.productPriority || 2
          const priorityB = b.productPriority || 2
          return sortOrder * (priorityA - priorityB)
        })
      }
    }

    const page = parseInt(queryOptions?.page) || 1
    const limit = parseInt(queryOptions?.limit) || 12
    const skip = (page - 1) * limit
    const productCounts = productsArray.length
    const wishlistProducts = productsArray.slice(skip, skip + limit)

    res.status(200).json({ wishlistProducts, productCounts })
  } 
  catch(error){
    console.error("Error in getAllWishlistProducts controller:", error.message)
    next(error)
  }
}


const updateList = async (req, res, next)=> {
  try {
    console.log("Inside updateList of wishlistController")
    const { listId, name, description, isPublic, sharedWith, reminderDate, expiryDate, priority } = req.body.updateListDetails
    const userId = req.user.id

    console.log("updateListDetails---->", JSON.stringify(req.body.updateListDetails))
    if (!listId) {
      return next(errorHandler(400, "List ID is required!"))
    }

    let wishlist = await Wishlist.findOne({ userId })
    if (!wishlist){
      return next(errorHandler(404, "Wishlist not found!"))
    }
    const listIndex = wishlist.lists.findIndex(list=> list._id.toString() === listId)
    if (listIndex === -1) {
      return next(errorHandler(404, "List not found!"))
    }

    const nameExists = wishlist.lists.some(
      list => list._id.toString() !== listId && list.name.toLowerCase() === name.toLowerCase()
    )
    if(nameExists){
      return next(errorHandler(400, "List name already exists!"))
    }

    const updatedList = wishlist.lists[listIndex];
    if (name) updatedList.name = name;
    if (description) updatedList.description = description;
    if (typeof isPublic !== "undefined") updatedList.isPublic = isPublic;
    if (sharedWith) updatedList.sharedWith = sharedWith;
    if (reminderDate) updatedList.reminderDate = reminderDate;
    if (expiryDate) updatedList.expiryDate = expiryDate;
    if (priority) updatedList.priority = priority;
    
    wishlist.lists[listIndex] = updatedList
    await wishlist.save()

    return res.status(200).json({ success: true, message: "List updated successfully", wishlist })
  }
  catch(error){
    console.error("Error updating wishlist:", error.message)
    next(error)
  }
}


const deleteList = async (req, res, next)=> {
  try {
    console.log("Inside deleteList of wishlistController")
    const {listId} = req.body
    const userId = req.user.id

    console.log(`listId from deleteList---->${listId}`)
    if (!listId) {
      return next(errorHandler(400, "List ID is required!"))
    }
    let wishlist = await Wishlist.findOne({ userId })
    if (!wishlist) {
      return next(errorHandler(404, "Wishlist not found!"))
    }

    const listIndex = wishlist.lists.findIndex(list => list._id.toString() === listId)
    if (listIndex === -1) {
      return next(errorHandler(404, "List not found!"))
    }

    wishlist.lists.splice(listIndex, 1)
    await wishlist.save()

    return res.status(200).json({ success: true, message: "List deleted successfully!" })
  }
  catch(error){
    console.error("Error deleting wishlist:", error.message)
    next(error)
  }
}


const searchList = async (req, res, next)=> {
  try {
    console.log("Inside searchList of wishlistController")
    const {find} = req.query
    const userId = req.user.id
    console.log("Searched data-->", find)

    if (!find){
      return next(errorHandler(400, "List name is required for search!"))
    }
    const wishlist = await Wishlist.findOne({ userId })
    if (!wishlist) {
      return next(errorHandler(404, "Wishlist not found!"))
    }

    const matchedLists = wishlist.lists.filter(list=> 
      list.name.toLowerCase().includes(find.toLowerCase())
    )
    if (matchedLists.length === 0) {
      return next(errorHandler(404, "No matching lists found!"))
    }

    return res.status(200).json({ success: true, matchedLists })
  } 
  catch(error){
    console.error("Error searching wishlist:", error.message)
    next(error)
  }
}






module.exports = {createList, addProductToList, removeProductFromList, getUserWishlist, getAllWishlistProducts, updateList,
   deleteList, searchList
}