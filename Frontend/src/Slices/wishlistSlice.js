import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createList = createAsyncThunk('wishlist/add', async ({wishlistDetails}, thunkAPI)=> {
  try {
    console.log('Inside createList createAsyncThunk')
    console.log("wishlistDetails from wishlistSlice---->", wishlistDetails)
    const response = await axios.post('/wishlist/add', {wishlistDetails}, {withCredentials: true})
    console.log('Returning success response from createList...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of createList')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const addProductToList = createAsyncThunk('addProductToList', async ({listName, productId}, thunkAPI)=> {
  try {
    console.log('Inside addProductToList createAsyncThunk')
    console.log(`productId from wishlistSlice----> ${productId} and listName from wishlistSlice---> ${listName}`)
    const response = await axios.post('/wishlist/product/add', {listName, productId}, {withCredentials: true})
    console.log('Returning success response from addProductToList...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of addProductToList')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

const initialState = {
  wishlist: {}, 
  listCreated: false,
  listRemoved: false,
  listUpdated: false,
  loading: false,
  wishlistError: null,
  wishlistSuccess: false,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlistStates: (state) => {
      state.loading = false
      state.wishlistError = null
      state.wishlistSuccess = false
      state.listCreated = false
      state.listRemoved = false
      state.listUpdated = false
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
        console.log('addProductToList fulfilled:', action.payload)
        state.wishlistError = null
        state.loading = false
        state.wishlistSuccess = true
        state.listUpdated = true
        state.wishlist = action.payload.wishlist
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
    }
})
  
export default wishlistSlice.reducer
export const {resetWishlistStates} = wishlistSlice.actions
