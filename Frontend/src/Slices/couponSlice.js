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
    console.log('Inside catch of getAllCoupons')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getEligibleCoupons = createAsyncThunk('coupon/list-eligible', async ({userId, queryOptions}, thunkAPI)=> {
  try {
    console.log('Inside getEligibleCoupons createAsyncThunk')
    console.log("couponDetails from couponSlice---->", queryOptions)
    const response = await axios.post('/coupons/list-eligible', {userId, queryOptions}, {withCredentials: true})
    console.log('Returning success response from getEligibleCoupons...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of getEligibleCoupons')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateCoupon = createAsyncThunk('coupon/update', async ({couponDetails, couponId}, thunkAPI)=> {
  try {
    console.log('Inside updateCoupon createAsyncThunk')
    console.log("couponDetails from couponSlice---->", couponDetails)
    const response = await axios.post(`/coupons/update/${couponId}`, {couponDetails}, {withCredentials: true})
    console.log('Returning success response from updateCoupon...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of updateCoupon')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const deleteCoupon = createAsyncThunk('coupon/delete', async ({couponId}, thunkAPI)=> {
  try {
    console.log('Inside deleteCoupon createAsyncThunk')
    console.log("couponId from couponSlice---->", couponId)
    const response = await axios.delete(`/coupons/delete/${couponId}`, {withCredentials: true})
    console.log('Returning success response from deleteCoupon...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of deleteCoupon')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const searchCoupons = createAsyncThunk('coupon/search', async ({query}, thunkAPI)=> {
  try {
    console.log('Inside searchCoupons createAsyncThunk')
    console.log("query from couponSlice---->", query)
    const response = await axios.get(`/coupons/?query=${query}`, {withCredentials: true})
    console.log('Returning success response from searchCoupons...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of searchCoupons')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getBestCoupon = createAsyncThunk('coupon/getBestCoupon', async (thunkAPI)=> {
  try {
    console.log('Inside getBestCoupon createAsyncThunk')
    const response = await axios.get('/coupons/bestCoupons', {withCredentials: true})
    console.log('Returning success response from getBestCoupon...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of getBestCoupon')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const toggleCouponStatus = createAsyncThunk('coupon/toggleCouponStatus', async ({couponId}, thunkAPI)=> {
  try {
    console.log('Inside toggleCouponStatus createAsyncThunk')
    const response = await axios.patch(`/coupons/toggle-status/${couponId}`, {withCredentials: true})
    console.log('Returning success response from toggleCouponStatus...', JSON.stringify(response.data))
    return {couponId, message: response.data.message}
  }catch(error){
    console.log('Inside catch of toggleCouponStatus')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
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
        state.totalCoupons = action.payload.totalCoupons
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
      .addCase(getEligibleCoupons.fulfilled, (state, action)=> {
        console.log('getEligibleCoupons fulfilled:', action.payload)
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
        console.log('getEligibleCoupons rejected:', action.payload)
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(updateCoupon.fulfilled, (state, action)=> {
        console.log('updateCoupon fulfilled:', action.payload)
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
        console.log('updateCoupon rejected:', action.payload)
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(deleteCoupon.fulfilled, (state, action)=> {
        console.log('deleteCoupon fulfilled:', action.payload)
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
        console.log('deleteCoupon rejected:', action.payload)
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(searchCoupons.fulfilled, (state, action)=> {
        console.log('searchCoupons fulfilled:', action.payload)
        state.couponError = null
        state.loading = false
        state.coupons = action.payload.coupons
      })
      .addCase(searchCoupons.pending, (state)=> {
        state.loading = true
        state.couponError = null
      })
      .addCase(searchCoupons.rejected, (state, action) => {
        console.log('searchCoupons rejected:', action.payload)
        state.loading = false
        state.couponError = action.payload
      })
      .addCase(getBestCoupon.fulfilled, (state, action)=> {
        console.log('getBestCoupon fulfilled:', action.payload)
        state.couponError = null
        state.bestCoupon = action.payload.bestCoupon
        state.couponMessage = action.payload.message
      })
      .addCase(getBestCoupon.pending, (state)=> {
        state.couponError = null
      })
      .addCase(getBestCoupon.rejected, (state, action) => {
        console.log('getBestCoupon rejected:', action.payload)
        state.couponError = action.payload
      })
      .addCase(toggleCouponStatus.fulfilled, (state, action)=> {
        console.log('toggleCouponStatus fulfilled:', action.payload)
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
        console.log('toggleCouponStatus rejected:', action.payload)
        state.couponError = action.payload
        state.couponToggled = false
      })
    }
})
  
export default couponSlice.reducer
export const {resetCouponStates} = couponSlice.actions
