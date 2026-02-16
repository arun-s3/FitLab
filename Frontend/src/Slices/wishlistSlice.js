import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const createList = createAsyncThunk('wishlist/add', async ({wishlistDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wishlist/add', wishlistDetails, { headers: {'Content-Type': 'multipart/form-data'}})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const addProductToList = createAsyncThunk('addProductToList', async ({listName, productId, productNote, productPriority}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wishlist/product/add', {listName, productId, productNote, productPriority})
    const state = thunkAPI.getState()
    const userId = state.user.user._id
    return {listName, productId, userId}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const removeProductFromList = createAsyncThunk('removeProductFromList', async ({listName, productId}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wishlist/product/delete', {listName, productId})
    return  {listName, productId}

  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getUserWishlist = createAsyncThunk('getUserWishlist', async (thunkAPI)=> {
  try {
    const response = await apiClient.get('/wishlist')
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getAllWishlistProducts = createAsyncThunk('getAllWishlistProducts', async( {queryOptions}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wishlist/products', {queryOptions})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateList = createAsyncThunk('updateList', async ({updateListDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.put('/wishlist/list/update', 
        updateListDetails, {headers: {'Content-Type': 'multipart/form-data'}})
    return response.data

  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const deleteList = createAsyncThunk('deleteList', async ({listId}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wishlist/list/delete', {listId})
    return {listId}

  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const searchList = createAsyncThunk('searchList', async ({find}, thunkAPI)=> {
  try {
    const response = await apiClient.get(`/wishlist/list/search?find=${find}`)
    return response.data

  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
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
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(addProductToList.fulfilled, (state, action)=> {
        state.loading = false
        state.wishlistError = null
        state.listProductAdded = true
       
        let {listName, productId} = action.payload
        listName = listName || "Default Shopping List"
        if (!state.wishlist.hasOwnProperty('lists')){
          state.wishlist = { userId: action.payload.userId, lists: [] }
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
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(removeProductFromList.fulfilled, (state, action) => {
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
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(getUserWishlist.fulfilled, (state, action)=> {
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
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(getAllWishlistProducts.fulfilled, (state, action)=> {
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
        state.loading = false
        state.wishlistError = action.payload
        state.wishlistSuccess = false
      })
      .addCase(updateList.fulfilled, (state, action)=> {
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
        state.loading = false
        state.wishlistError = action.payload
        state.listUpdated = false
      })
      .addCase(deleteList.fulfilled, (state, action)=> {
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
        state.loading = false
        state.wishlistError = action.payload
        state.listDeleted = false
      })
      .addCase(searchList.fulfilled, (state, action)=> {
        state.loading = false
        state.wishlistError = null
        state.wishlist.lists = action.payload.matchedLists
      })
      .addCase(searchList.pending, (state)=> {
        state.loading = true
        state.wishlistError = null
      })
      .addCase(searchList.rejected, (state, action)=> {
        state.loading = false
        state.wishlistError = action.payload
      })
      
    }
})
  
export default wishlistSlice.reducer
export const {resetWishlistStates} = wishlistSlice.actions
