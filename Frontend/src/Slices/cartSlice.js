import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const addToCart = createAsyncThunk('cart/addToCart', async ({productId, quantity}, thunkAPI) => {
  try {
    const response = await apiClient.post('/cart/add', {productId, quantity})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error?.message ||  'Something went wrong. Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const reduceFromCart = createAsyncThunk('cart/reduceFromCart', async ({productId, quantity}, thunkAPI) => {
  try {
    const response = await apiClient.post('/cart/reduce', {productId, quantity})
    return {productId, quantity, couponDiscount: response.data.couponDiscount, deliveryCharge: response.data.deliveryCharge, total: response.data.total,
      absoluteTotal: response.data.absoluteTotal, absoluteTotalWithTaxes: response.data.absoluteTotalWithTaxes, gst: response.data.gst}
  }catch(error){
    const errorMessage = error.response?.data?.message || error?.message ||  'Something went wrong. Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({productId}, thunkAPI) => {
  try {
    const response = await apiClient.post('/cart/delete', {productId})
    return {productId, couponDiscount: response.data.couponDiscount, deliveryCharge: response.data.deliveryCharge,
       absoluteTotalWithTaxes: response.data.absoluteTotalWithTaxes, gst: response.data.gst}
  }catch(error){
    const errorMessage = error.response?.data?.message || error?.message ||  'Something went wrong. Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getTheCart = createAsyncThunk('cart/getTheCart', async (_, thunkAPI) => {
  try {
    const response = await apiClient.get('/cart')
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error?.message ||  'Internal Server Error.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async ({couponCode}, thunkAPI) => {
  try {
    const response = await apiClient.post('/cart/apply-coupon', {couponCode})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error?.message ||  'Something went wrong. Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const removeCoupon = createAsyncThunk('cart/removeCoupon', async (_, thunkAPI) => {
  try {
    const response = await apiClient.get('/cart/remove-coupon')
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error?.message ||  'Something went wrong. Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

const initialState = {
  cart: null, 
  productAdded: false,
  productReduced: false,
  productRemoved: false,
  couponApplied: false,
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
      state.couponApplied = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
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
        state.loading = false
        state.error = action.payload
        state.message = action.payload?.message || action.payload
        state.success = false
      })
      .addCase(reduceFromCart.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        
        const productIndex = state.cart.products.findIndex( (item)=> item.productId._id === action.payload.productId )
        if (productIndex === -1){
          return
        }

        if ( state.cart.products[productIndex].quantity - action.payload.quantity > 0 ) {
          state.cart.products = state.cart.products.map((item) =>
            item.productId._id.toString() === action.payload.productId.toString()
              ? { ...item, total: action.payload.total, quantity: item.quantity - action.payload.quantity }
              : item
          )
        }
        else{
          const newCartProducts = state.cart.products.filter(
            (item)=> item.productId._id.toString() !== action.payload.productId.toString()
          )
          state.cart.products = [...newCartProducts]
        }    
        
        state.cart.absoluteTotal = action.payload.absoluteTotal;
        state.cart.couponDiscount = action.payload.couponDiscount;
        state.cart.gst = action.payload.gst
        state.cart.deliveryCharge = action.payload.deliveryCharge;
        state.cart.absoluteTotalWithTaxes = action.payload.absoluteTotalWithTaxes;
      
        if (state.cart.products.length <= 0) {
          state.cart.couponDiscount = 0
          state.cart.deliveryCharge = 0
          state.cart.absoluteTotalWithTaxes = 0
          state.cart.couponUsed = null
        }
      
        state.productReduced = true
        state.productAdded = false
      })
      .addCase(reduceFromCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(reduceFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.message = action.payload.message
        state.success = false
        state.productReduced = false
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        
        const productIndex = state.cart.products.findIndex( (item) => item.productId._id.toString() === action.payload.productId.toString() )

        if (productIndex !== -1) {
          const productToRemove = state.cart.products[productIndex]
          state.cart.products.splice(productIndex, 1)
          state.cart.absoluteTotal = Math.max(0, state.cart.absoluteTotal - productToRemove.total);
        }
      
        state.cart.couponDiscount = action.payload.couponDiscount;
        state.cart.gst = action.payload.gst
        state.cart.deliveryCharge = action.payload.deliveryCharge;
        state.cart.absoluteTotalWithTaxes = action.payload.absoluteTotalWithTaxes;
      
        if (state.cart.products.length === 0) {
          state.cart.couponDiscount = 0
          state.cart.deliveryCharge = 0
          state.cart.absoluteTotalWithTaxes = 0
          state.cart.couponUsed = null
        }
      
        state.productRemoved = true
        state.productAdded = false
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.message = action.payload.message
        state.success = false
      })
      .addCase(getTheCart.fulfilled, (state, action) => {
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
        state.loading = false
        state.error = action.payload
        state.message = action.payload
        state.success = false
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.error = null
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.couponApplied = true

        if( action.payload?.newTotal ){
          state.cart.absoluteTotalWithTaxes = action.payload.newTotal
          state.cart.deliveryCharge = action.payload.deliveryCharge
          state.cart.couponDiscount = action.payload.couponDiscount
        }
      })
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.message = action.payload.message
        state.success = false
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.error = null
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.couponApplied = false
        state.cart.absoluteTotalWithTaxes = action.payload.absoluteTotalWithTaxes
        state.cart.deliveryCharge = action.payload.deliveryCharge
        state.cart.couponDiscount = action.payload.couponDiscount
        state.cart.couponUsed = null
      })
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.message = action.payload.message
        state.success = false
      })
    }
    })
  
export default cartSlice.reducer
export const {resetCartStates} = cartSlice.actions
