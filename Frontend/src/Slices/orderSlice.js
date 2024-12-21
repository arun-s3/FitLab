import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createOrder = createAsyncThunk('order/createOrder', async ({orderDetails}, thunkAPI) => {
  try {
    console.log('Inside createOrder createAsyncThunk');
    console.log("orderDetails from ordrSlice---->", orderDetails)
    const response = await axios.post('/order/add', {orderDetails}, {withCredentials: true})
    console.log('Returning success response from createOrder...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of createOrder')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})


const initialState = {
  orders: [], 
  orderCreated: false,
  OrderRemoved: false,
  loading: false,
  orderError: null,
  orderSuccess: false,
  orderMessage: null,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderStates: (state) => {
      state.loading = false
      state.orderError = null
      state.orderMessage = null
      state.orderSuccess = false
      state.orderCreated = false
      state.OrderRemoved = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log('addToCart fulfilled:', action.payload)
        state.orderError = null
        state.loading = false
        state.orderSuccess = true
        state.orderMessage = action.payload.message
        state.orders.push(action.payload.order) 
        state.orderCreated = true
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(createOrder.rejected, (state, action) => {
        console.log('addToCart rejected:', action.payload)
        state.loading = false
        state.orderError = action.payload
        state.orderMessage = action.payload.message
        state.orderSuccess = false
      })
    }
})
  
export default orderSlice.reducer
export const {resetOrderStates} = orderSlice.actions
