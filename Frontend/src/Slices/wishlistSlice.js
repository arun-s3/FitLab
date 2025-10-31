import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createList = createAsyncThunk('wishlist/add', async ({wishlistDetails}, thunkAPI)=> {
  try {
    console.log('Inside createList createAsyncThunk')
    console.log("wishlistDetails from wishlistSlice---->", wishlistDetails)
    const response = await axios.post('/wishlist/add', wishlistDetails, {withCredentials: true, headers: {'Content-Type': 'multipart/form-data'}})
    console.log('Returning success response from createList...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of createList')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const addProductToList = createAsyncThunk('addProductToList', async ({listName, productId, productNote, productPriority}, thunkAPI)=> {
  try {
    console.log('Inside addProductToList createAsyncThunk')
    console.log(`productId from wishlistSlice----> ${productId} and listName from wishlistSlice---> ${listName}`)
    const response = await axios.post('/wishlist/product/add', {listName, productId, productNote, productPriority}, {withCredentials: true})
    console.log('Returning success response from addProductToList...', JSON.stringify(response.data))
    const state = thunkAPI.getState()
    const userId = state.user.user._id
    return {listName, productId, userId}
  }catch(error){
    console.log('Inside catch of addProductToList')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const removeProductFromList = createAsyncThunk('removeProductFromList', async ({listName, productId}, thunkAPI)=> {
  try {
    console.log('Inside removeProductFromList createAsyncThunk')
    console.log(`productId from wishlistSlice----> ${productId} and listName from wishlistSlice---> ${listName}`)
    const response = await axios.post('/wishlist/product/delete', {listName, productId}, {withCredentials: true})
    console.log('Returning success response from removeProductFromList...', JSON.stringify(response.data))
    return  {listName, productId}

  }catch(error){
    console.log('Inside catch of removeProductFromList')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getUserWishlist = createAsyncThunk('getUserWishlist', async (thunkAPI)=> {
  try {
    console.log('Inside getUserWishlist createAsyncThunk')
    const response = await axios.get('/wishlist', {withCredentials: true})
    console.log('Returning success response from getUserWishlist...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of getUserWishlist')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getAllWishlistProducts = createAsyncThunk('getAllWishlistProducts', async( {queryOptions}, thunkAPI)=> {
  try {
    console.log('Inside getAllWishlistProducts createAsyncThunk')
    const response = await axios.post('/wishlist/products', {queryOptions}, {withCredentials: true})
    console.log('Returning success response from getAllWishlistProducts...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of getAllWishlistProducts')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateList = createAsyncThunk('updateList', async ({updateListDetails}, thunkAPI)=> {
  try {
    console.log('Inside updateList createAsyncThunk')
    console.log('updateListDetails from updateList---->', updateListDetails)
    const response = await axios.put('/wishlist/list/update', 
        updateListDetails, {withCredentials: true, headers: {'Content-Type': 'multipart/form-data'}})
    console.log('Returning success response from updateList...', JSON.stringify(response.data))
    return response.data

  }catch(error){
    console.log('Inside catch of updateList')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const deleteList = createAsyncThunk('deleteList', async ({listId}, thunkAPI)=> {
  try {
    console.log('Inside deleteList createAsyncThunk')
    console.log('listId from deleteList---->', listId)
    const response = await axios.post('/wishlist/list/delete', {listId}, {withCredentials: true})
    console.log('Returning success response from deleteList...', JSON.stringify(response.data))
    return {listId}

  }catch(error){
    console.log('Inside catch of deleteList')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const searchList = createAsyncThunk('searchList', async ({find}, thunkAPI)=> {
  try {
    console.log('Inside searchList createAsyncThunk')
    console.log('searched list from searchList---->', find)
    const response = await axios.get(`/wishlist/list/search?find=${find}`, {withCredentials:true})
    console.log('Returning success response from searchList...', JSON.stringify(response.data))
    return response.data

  }catch(error){
    console.log('Inside catch of searchList')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})


const initialState = {
  wishlist: {lists: []}, 
  wishlistProducts: [],
  listCreated: false,
  listRemoved: false,
  listUpdated: false,
  listProductAdded: false,
  listProductRemoved: false,
  loading: false,
  wishlistError: null,
  wishlistSuccess: false,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlistStates: (state)=> {
      state.loading = false
      state.wishlistError = null
      state.wishlistSuccess = false
      state.listCreated = false
      state.listRemoved = false
      state.listUpdated = false
      state.listProductAdded = false
      state.listProductRemoved = false
    }
  },
  extraReducers: (builder)=> {
    builder
      .addCase(createList.fulfilled, (state, action)=> {
        console.log('createList fulfilled:', action.payload)
        state.wishlistError = null
        state.loading = false
        state.wishlistSuccess = true
        state.listCreated = true
        state.wishlist = action.payload.wishlist
      })
      .addCase(createList.pending, (state)=> {
        state.loading = true
        state.wishlistError = null
      })
      .addCase(createList.rejected, (state, action) => {
        console.log('createList rejected:', action.payload)
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(addProductToList.fulfilled, (state, action)=> {
        console.log("addProductToList fulfilled:", action.payload)
        state.loading = false
        state.wishlistError = null
        state.listProductAdded = true
       
        let {listName, productId} = action.payload
        listName = listName || "Default Shopping List"

        console.log("Wishlist from addProductToList.fulfilled--->", state.wishlist)

        if (!state.wishlist.hasOwnProperty('lists')){
          state.wishlist = { userId: action.payload.userId, lists: [] }
          console.log("Wishlist now", state.wishlist)
        }

        const listIndex = state.wishlist.lists.findIndex( (list)=> list.name === listName )
      
        if (listIndex !== -1) {
          const productAlreadyExists = state.wishlist.lists[listIndex].products.some(
            (product) => product.product === productId
          )
      
          if (!productAlreadyExists) {
            state.wishlist.lists[listIndex].products.push({ product: productId })
          }
        }else{
          state.wishlist.lists.push({ name: listName, products: [{ product: productId }] })
        }
      })
      .addCase(addProductToList.pending, (state)=> {
        state.loading = true
        state.wishlistError = null
      })
      .addCase(addProductToList.rejected, (state, action) => {
        console.log('addProductToList rejected:', action.payload)
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(removeProductFromList.fulfilled, (state, action) => {
        console.log("removeProductFromList fulfilled:", action.payload)
        state.loading = false
        state.wishlistError = null
        state.listProductRemoved = true
      
        let {listName, productId} = action.payload
        listName = listName || "Default Shopping List"
        const listIndex = state.wishlist.lists.findIndex( (list) => list.name === listName )
      
        if (listIndex !== -1){
          state.wishlist.lists[listIndex].products = state.wishlist.lists[listIndex].products.filter(
            (product) => product.product !== productId
          )
        }
      })      
      .addCase(removeProductFromList.pending, (state)=> {
        state.loading = true
        state.wishlistError = null
      })
      .addCase(removeProductFromList.rejected, (state, action) => {
        console.log('removeProductFromList rejected:', action.payload)
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(getUserWishlist.fulfilled, (state, action)=> {
        console.log('getUserWishlist fulfilled:', action.payload)
        state.wishlistError = null
        state.loading = false
        state.wishlistSuccess = true
        state.wishlist = action.payload.wishlist
      })
      .addCase(getUserWishlist.pending, (state)=> {
        state.loading = true
        state.wishlistError = null
      })
      .addCase(getUserWishlist.rejected, (state, action) => {
        console.log('getUserWishlist rejected:', action.payload)
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(getAllWishlistProducts.fulfilled, (state, action)=> {
        console.log('getAllWishlistProducts fulfilled:', action.payload)
        state.wishlistError = null
        state.loading = false
        state.wishlistSuccess = true
        state.wishlistProducts = action.payload.wishlistProducts
      })
      .addCase(getAllWishlistProducts.pending, (state)=> {
        state.loading = true
        state.wishlistError = null
      })
      .addCase(getAllWishlistProducts.rejected, (state, action)=> {
        console.log('getAllWishlistProducts rejected:', action.payload)
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(updateList.fulfilled, (state, action)=> {
        console.log("updateList fulfilled:", action.payload)
        state.loading = false
        state.wishlistError = null
        state.listUpdated = true
        state.wishlist.lists[action.payload.listIndex] = action.payload.updatedList
      })
      .addCase(updateList.pending, (state)=> {
        state.loading = true
        state.wishlistError = null
      })
      .addCase(updateList.rejected, (state, action)=> {
        console.log("updateList rejected:", action.payload)
        state.loading = false
        state.wishlistError = action.payload
        state.listUpdated = false
      })
      .addCase(deleteList.fulfilled, (state, action)=> {
        console.log('deleteList fulfilled:', action.payload)
        state.loading = false
        state.wishlistError = null
        state.listRemoved = true
  
        const {listId} = action.payload
        if (state.wishlist?.lists){
          state.wishlist.lists = state.wishlist.lists.filter(list => list._id !== listId)
        }
      })
      .addCase(deleteList.pending, (state)=> {
        state.loading = true
        state.wishlistError = null
      })
      .addCase(deleteList.rejected, (state, action)=> {
        console.log('deleteList rejected:', action.payload)
        state.loading = false
        state.wishlistError = action.payload
        state.listDeleted = false
      })
      .addCase(searchList.fulfilled, (state, action)=> {
        console.log('searchList fulfilled:', action.payload)
        state.loading = false
        state.wishlistError = null
        state.wishlist.lists = action.payload.matchedLists
      })
      .addCase(searchList.pending, (state)=> {
        state.loading = true
        state.wishlistError = null
      })
      .addCase(searchList.rejected, (state, action)=> {
        console.log('searchList rejected:', action.payload)
        state.loading = false
        state.wishlistError = action.payload
      })
      
    }
})
  
export default wishlistSlice.reducer
export const {resetWishlistStates} = wishlistSlice.actions
