import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createCoupon = createAsyncThunk('coupon/add', async ({couponDetails}, thunkAPI)=> {
  try {
    console.log('Inside createCoupon createAsyncThunk')
    console.log("couponDetails from couponSlice---->", couponDetails)
    const response = await axios.post('/coupons/add', {couponDetails}, {withCredentials: true})
    console.log('Returning success response from createCoupon...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of createCoupon')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getAllCoupons = createAsyncThunk('coupon/list', async ({queryOptions}, thunkAPI)=> {
  try {
    console.log('Inside getAllCoupons createAsyncThunk')
    console.log("couponDetails from couponSlice---->", queryOptions)
    const response = await axios.post('/coupons/list', {queryOptions}, {withCredentials: true})
    console.log('Returning success response from getAllCoupons...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of averageRating')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})


const initialState = {
    coupons: [], 
    couponCreated: false,
    couponRemoved: false,
    couponUpdated: false,
    loading: false,
    couponError: null,
}

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    resetCouponStates: (state)=> {
      state.loading = false
      state.couponError = null
      state.couponCreated = false
      state.couponRemoved = false
      state.couponUpdated = false
    }
  },
  extraReducers: (builder)=> {
    builder
      .addCase(createCoupon.fulfilled, (state, action)=> {
        console.log('createCoupon fulfilled:', action.payload)
        state.couponError = null
        state.loading = false
        state.couponCreated = true
        state.coupons.push(action.payload.coupon)
      })
      .addCase(createCoupon.pending, (state)=> {
        state.loading = true
        state.couponError = null
      })
      .addCase(createCoupon.rejected, (state, action) => {
        console.log('createCoupon rejected:', action.payload)
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(getAllCoupons.fulfilled, (state, action)=> {
        console.log('getAllCoupons fulfilled:', action.payload)
        state.couponError = null
        state.loading = false
        state.coupons = action.payload.coupons
      })
      .addCase(getAllCoupons.pending, (state)=> {
        state.loading = true
        state.couponError = null
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        console.log('getAllCoupons rejected:', action.payload)
        state.loading = false
        state.couponError = action.payload
      })
      
    }
})
  
export default couponSlice.reducer
export const {resetCouponStates} = couponSlice.actions
