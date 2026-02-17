import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const createCoupon = createAsyncThunk('coupon/add', async ({couponDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/coupons/add', {couponDetails})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getAllCoupons = createAsyncThunk('coupon/list', async ({queryOptions}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/coupons/list', {queryOptions})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getEligibleCoupons = createAsyncThunk('coupon/list-eligible', async ({userId, queryOptions}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/coupons/list-eligible', {userId, queryOptions})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateCoupon = createAsyncThunk('coupon/update', async ({couponDetails, couponId}, thunkAPI)=> {
  try {
    const response = await apiClient.post(`/coupons/update/${couponId}`, {couponDetails})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const deleteCoupon = createAsyncThunk('coupon/delete', async ({couponId}, thunkAPI)=> {
  try {
    const response = await apiClient.delete(`/coupons/delete/${couponId}`)
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const searchCoupons = createAsyncThunk('coupon/search', async ({query}, thunkAPI)=> {
  try {
    const response = await apiClient.get(`/coupons/?query=${query}`)
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getBestCoupon = createAsyncThunk('coupon/getBestCoupon', async (_, thunkAPI)=> {
  try {
    const response = await apiClient.get('/coupons/bestCoupons')
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const toggleCouponStatus = createAsyncThunk('coupon/toggleCouponStatus', async ({couponId}, thunkAPI)=> {
  try {
    const response = await apiClient.patch(`/coupons/toggle-status/${couponId}`)
    return {couponId, message: response.data.message}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})


const initialState = {
    coupons: [], 
    bestCoupon: {},
    totalCoupons: null,
    couponCreated: false,
    couponRemoved: false,
    couponUpdated: false,
    couponToggled: false,
    loading: false,
    couponMessage: null,
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
      state.couponToggled = false
    }
  },
  extraReducers: (builder)=> {
    builder
      .addCase(createCoupon.fulfilled, (state, action)=> {
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
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(getAllCoupons.fulfilled, (state, action)=> {
        state.couponError = null
        state.loading = false
        state.coupons = action.payload.coupons
        state.totalCoupons = action.payload.totalCoupons
      })
      .addCase(getAllCoupons.pending, (state)=> {
        state.loading = true
        state.couponError = null
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(getEligibleCoupons.fulfilled, (state, action)=> {
        state.couponError = null
        state.loading = false
        state.coupons = action.payload.coupons
        state.totalCoupons = action.payload.totalCoupons
      })
      .addCase(getEligibleCoupons.pending, (state)=> {
        state.loading = true
        state.couponError = null
      })
      .addCase(getEligibleCoupons.rejected, (state, action) => {
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(updateCoupon.fulfilled, (state, action)=> {
        state.couponError = null
        state.loading = false
        state.couponUpdated = true
        state.coupons = state.coupons.map(coupon=> {
          if(coupon._id === action.payload.coupon._id){
            return action.payload.coupon
          }else{
            return coupon
          } 
        })
      })
      .addCase(updateCoupon.pending, (state)=> {
        state.loading = true
        state.couponError = null
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(deleteCoupon.fulfilled, (state, action)=> {
        state.couponError = null
        state.loading = false
        state.couponRemoved = true
        state.coupons = state.coupons.filter(coupon=> coupon._id != action.payload.deletedCoupon._id)
      })
      .addCase(deleteCoupon.pending, (state)=> {
        state.loading = true
        state.couponError = null
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(searchCoupons.fulfilled, (state, action)=> {
        state.couponError = null
        state.loading = false
        state.coupons = action.payload.coupons
      })
      .addCase(searchCoupons.pending, (state)=> {
        state.loading = true
        state.couponError = null
      })
      .addCase(searchCoupons.rejected, (state, action) => {
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(getBestCoupon.fulfilled, (state, action)=> {
        state.couponError = null
        state.bestCoupon = action.payload.bestCoupon
        state.couponMessage = action.payload.message
      })
      .addCase(getBestCoupon.pending, (state)=> {
        state.couponError = null
      })
      .addCase(getBestCoupon.rejected, (state, action) => {
        state.couponError = action.payload
      })
      .addCase(toggleCouponStatus.fulfilled, (state, action)=> {
        state.couponError = null
        state.couponToggled = true
        state.coupons =  state.coupons.map(coupon=> {
          if(coupon._id === action.payload.couponId){
            coupon.status = coupon.status === "active" ? "deactivated" : "active"
          }
          return coupon
        })
      })
      .addCase(toggleCouponStatus.pending, (state)=> {
        state.couponError = null
      })
      .addCase(toggleCouponStatus.rejected, (state, action) => {
        state.couponError = action.payload
        state.couponToggled = false
      })
    }
})
  
export default couponSlice.reducer
export const {resetCouponStates} = couponSlice.actions
