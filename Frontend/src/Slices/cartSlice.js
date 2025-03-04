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
    return {productId, couponDiscount: response.data.couponDiscount, deliveryCharge: response.data.deliveryCharge,
       absoluteTotalWithTaxes: response.data.absoluteTotalWithTaxes, gst: response.data.gst}
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

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async ({couponCode}, thunkAPI) => {
  try {
    console.log('Inside applyCoupon createAsyncThunk');
    const response = await axios.post('/cart/apply-coupon', {couponCode}, {withCredentials: true})
    console.log('Returning success response from applyCoupon...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of applyCoupon')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const removeCoupon = createAsyncThunk('cart/removeCoupon', async (thunkAPI) => {
  try {
    console.log('Inside removeCoupon createAsyncThunk')
    const response = await axios.get('/cart/remove-coupon', {withCredentials: true})
    console.log('Returning success response from removeCoupon...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of removeCoupon')
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
      // .addCase(removeFromCart.fulfilled, (state, action) => {
      //   console.log('removeFromCart fulfilled:', action.payload)
      //   state.error = null
      //   state.loading = false
      //   state.success = true
      //   state.message = action.payload.message

      //   const productIndex = state.cart.products.findIndex((item) => item.productId.toString() === action.payload.productId)
      //   const productToRemove = state.cart.products[productIndex]
      //   const amountToDeduct = productToRemove.total
      //   state.cart.products.splice(productIndex, 1)
      //   state.cart.absoluteTotal -= amountToDeduct
      //   console.log("state.cart--->", JSON.stringify(state.cart))
      //   state.cart.couponDiscount = action.payload.couponDiscount
      //   state.cart.deliveryCharge = action.payload.deliveryCharge
      //   state.cart.absoluteTotalWithTaxes = action.payload.absoluteTotalWithTaxes
      //   state.productRemoved = true
      //   state.productAdded = false
      // })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        console.log("removeFromCart fulfilled:", action.payload);
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        
        console.log(`action.payload.couponDiscount---${action.payload.couponDiscount}, 
          action.payload.deliveryCharge-->${action.payload.deliveryCharge}, action.payload.absoluteTotalWithTaxes-->${action.payload.absoluteTotalWithTaxes},
           `)
        const productIndex = state.cart.products.findIndex( (item) => item.productId.toString() === action.payload.productId )

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
      .addCase(applyCoupon.fulfilled, (state, action) => {
        console.log('applyCoupon fulfilled:', action.payload)
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
        console.log('applyCoupon rejected:', action.payload)
        state.loading = false
        state.error = action.payload
        state.message = action.payload.message
        state.success = false
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        console.log('removeCoupon fulfilled:', action.payload)
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
        console.log('removeCoupon rejected:', action.payload)
        state.loading = false
        state.error = action.payload
        state.message = action.payload.message
        state.success = false
      })
    }
    })
  
export default cartSlice.reducer
export const {resetCartStates} = cartSlice.actions
