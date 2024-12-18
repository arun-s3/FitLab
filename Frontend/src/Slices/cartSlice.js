import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const addToCart = createAsyncThunk('cart/addToCart', async ({productId, quantity}, thunkAPI) => {
  try {
    console.log('Inside addToCart createAsyncThunk');
    const response = await axios.post('/cart/add', {productId, quantity}, {withCredentials: true})
    console.log('Returning success response from addToCart...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of addToCart')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({productId}, thunkAPI) => {
  try {
    console.log('Inside removeFromCart createAsyncThunk');
    const response = await axios.post('/cart/delete', {productId}, {withCredentials: true})
    console.log('Returning success response from removeFromCart...', JSON.stringify(response.data))
    return {productId, cart: response.data.cart}
  }catch(error){
    console.log('Inside catch of removeFromCart')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getTheCart = createAsyncThunk('cart/getTheCart', async (thunkAPI) => {
  try {
    console.log('Inside getTheCart createAsyncThunk');
    const response = await axios.get('/cart', {withCredentials: true})
    console.log('Returning success response from getTheCart...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of getTheCart')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

const initialState = {
  cart: null, 
  productAdded: false,
  productRemoved: false,
  loading: false,
  error: null,
  success: false,
  message: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartStates: (state) => {
      state.loading = false
      state.error = null
      state.message = null
      state.success = false
      state.productAdded = false
      state.productRemoved = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        console.log('addToCart fulfilled:', action.payload)
        state.error = null
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.cart = action.payload.cart
        state.productAdded = true
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCart.rejected, (state, action) => {
        console.log('addToCart rejected:', action.payload)
        state.loading = false
        state.error = action.payload
        state.message = action.payload.message
        state.success = false
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        console.log('removeFromCart fulfilled:', action.payload)
        state.error = null
        state.loading = false
        state.success = true
        state.message = action.payload.message

        const productIndex = state.cart.products.findIndex((item) => item.productId.toString() === action.payload.productId)
        const productToRemove = state.cart.products[productIndex]
        const amountToDeduct = productToRemove.total
        state.cart.products.splice(productIndex, 1)
        state.cart.absoluteTotal -= amountToDeduct
        console.log("state.cart--->", JSON.stringify(state.cart))
        state.productRemoved = true
        state.productAdded = false
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        console.log('removeFromCart rejected:', action.payload)
        state.loading = false
        state.error = action.payload
        state.message = action.payload.message
        state.success = false
      })
      .addCase(getTheCart.fulfilled, (state, action) => {
        console.log('getTheCart fulfilled:', action.payload)
        state.error = null
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.cart = action.payload.cart
      })
      .addCase(getTheCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTheCart.rejected, (state, action) => {
        console.log('getTheCart rejected:', action.payload)
        state.loading = false
        state.error = action.payload
        state.message = action.payload.message
        state.success = false
      })
    }
    })
  
export default cartSlice.reducer
export const {resetCartStates} = cartSlice.actions
