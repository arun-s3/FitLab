import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createOrder = createAsyncThunk('order/createOrder', async ({orderDetails}, thunkAPI)=> {
  try {
    console.log('Inside createOrder createAsyncThunk');
    console.log("orderDetails from ordrSlice---->", orderDetails)
    const response = await axios.post('/order/add', {orderDetails}, {withCredentials: true})
    console.log('Returning success response from createOrder...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of createOrder')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getOrders = createAsyncThunk('order/getOrders', async ({queryDetails}, thunkAPI)=> {
  try {
    console.log('Inside getOrders createAsyncThunk');
    console.log("orderDetails from ordrSlice---->", queryDetails)
    const response = await axios.post('/order', {queryDetails}, {withCredentials: true})
    console.log('Returning success response from getOrders...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of getOrders')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getAllUsersOrders = createAsyncThunk('order/getAllUsersOrders', async ({queryDetails}, thunkAPI)=> {
  try {
    console.log('Inside getAllUsersOrders createAsyncThunk');
    console.log("orderDetails from ordrSlice---->", queryDetails)
    const response = await axios.post('/order/all', {queryDetails}, {withCredentials: true})
    console.log('Returning success response from getOrders...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of getOrders')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const cancelOrder = createAsyncThunk('order/cancelOrder', async ({orderId, orderCancelReason}, thunkAPI)=> {
  try {
    console.log('Inside cancelOrder createAsyncThunk');
    console.log("orderId from orderSlice---->", orderId)
    const response = await axios.patch(`/order/cancel/${orderId}`,{orderCancelReason}, {withCredentials: true})
    console.log('Returning success response from cancelOrder...', JSON.stringify(response.data))
    return {orderId, cart: response.data.order}
  }catch(error){
    console.log('Inside catch of cancelOrder')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const cancelOrderProduct = createAsyncThunk('order/cancelOrderProduct', async ({orderId, productId, productCancelReason}, thunkAPI)=> {
    try {
      console.log('Inside cancelOrderProduct createAsyncThunk');
      console.log(`orderId and productId from orderSlice----> ${orderId} and ${productId}}`)
      const response = await axios.patch(`/order/cancel`, {orderId, productId, productCancelReason}, {withCredentials: true})
      console.log('Returning success response from cancelOrderProduct...', JSON.stringify(response.data))
      return {orderId, productId, updatedOrder: response.data.order, message: response.data.message}
    }catch(error) {
      console.log('Inside catch of cancelOrder')
      const errorMessage = error.response?.data?.message
      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const deleteProductFromOrderHistory = createAsyncThunk('order/deleteProductFromOrderHistory', async ({orderId, productId}, thunkAPI)=> {
  try {
    console.log('Inside deleteProductFromOrderHistory createAsyncThunk');
    console.log(`orderId and productId from orderSlice----> ${orderId} and ${productId}}`)
    const response = await axios.post(`/order/delete/${orderId}`, {productId}, {withCredentials: true})
    console.log('Returning success response from deleteProductFromOrderHistory...', JSON.stringify(response.data))
    return {orderId, productId, updatedOrder: response.data.order, message: response.data.message}
  }catch(error) {
    console.log('Inside catch of deleteProductFromOrderHistory')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
}
)

export const changeOrderStatus = createAsyncThunk('order/changeOrderStatus', async ({orderId, newStatus}, thunkAPI)=> {
  try {
    console.log('Inside changeOrderStatus createAsyncThunk');
    console.log("orderId from orderSlice---->", orderId)
    const response = await axios.patch(`/order/status/${orderId}`,{newStatus}, {withCredentials: true})
    console.log('Returning success response from changeOrderStatus...', JSON.stringify(response.data))
    return {orderId, updatedOrder: response.data.updatedOrder}
  }catch(error){
    console.log('Inside catch of cancelOrder')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const changeProductStatus = createAsyncThunk('order/changeProductStatus', async ({orderId, productId, newProductStatus}, thunkAPI)=> {
  try {
    console.log('Inside changeProductStatus createAsyncThunk');
    console.log("orderId from orderSlice---->", orderId)
    const response = await axios.patch(`/order/status/${orderId}/products/${productId}`,{newProductStatus}, {withCredentials: true})
    console.log('Returning success response from changeProductStatus...', JSON.stringify(response.data))
    return {orderId, productId, updatedProduct: response.data.updatedProduct}
  }catch(error){
    console.log('Inside catch of changeProductStatus')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})


const initialState = {
  orders: [], 
  orderCreated: false,
  OrderRemoved: false,
  orderCancelled: false,
  orderUpdated: false,
  totalUsersOrders: null,
  totalOrders:null,
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
      state.orderCancelled = false
      state.orderUpdated = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log('createOrder fulfilled:', action.payload)
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
        console.log('createOrder rejected:', action.payload)
        state.loading = false
        state.orderError = action.payload
        state.orderMessage = action.payload.message
        state.orderSuccess = false
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        console.log('getOrders fulfilled:', action.payload)
        state.orderError = null
        state.loading = false
        state.orderSuccess = true
        state.orderMessage = action.payload.message
        state.orders = action.payload.orders
        state.totalOrders = action.payload.pagination.totalOrders
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(getOrders.rejected, (state, action) => {
        console.log('getOrders rejected:', action.payload)
        state.loading = false
        state.orderError = action.payload
        state.orderMessage = action.payload.message
        state.orderSuccess = false 
      })
      .addCase(getAllUsersOrders.fulfilled, (state, action) => {
        console.log('getAllUsersOrders fulfilled:', action.payload)
        state.orderError = null
        state.loading = false
        state.orderSuccess = true
        state.orderMessage = action.payload.message
        state.orders = action.payload.orders
        state.totalUsersOrders = action.payload.pagination.totalOrders
      })
      .addCase(getAllUsersOrders.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(getAllUsersOrders.rejected, (state, action) => {
        console.log('getAllUsersOrders rejected:', action.payload)
        state.loading = false
        state.orderError = action.payload
        state.orderMessage = action.payload.message
        state.orderSuccess = false 
      })
      .addCase(cancelOrder.fulfilled, (state, action) => { 
        console.log('cancelOrder fulfilled:', action.payload)
        state.orderError = null
        state.loading = false
        state.orderCancelled = true
        state.orderMessage = action.payload.message

        state.orders = state.orders.map(order=> {
          if(order._id === action.payload.orderId){
            order.orderStatus = "cancelled"
            order.products = order.products.map(product=> {
              product.productStatus = "cancelled"
              return product
            })
          } 
          return order
        })
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        console.log('cancelOrder rejected:', action.payload)
        state.loading = false
        state.orderError = true
        state.orderMessage = action.payload.message
        state.orderCancelled = false
      })
      .addCase(cancelOrderProduct.fulfilled, (state, action) => {
        console.log('cancelOrderProduct fulfilled:', action.payload);
        state.orderError = null;
        state.loading = false;
        state.productCancelled = true;
        state.orderMessage = action.payload.message;

        state.orders = state.orders.map((order)=> {
          if (order._id === action.payload.orderId){
            order.products = order.products.map(product=> {
              if(product.productId === action.payload.productId){
                product.productStatus = 'cancelled'
              }
              return product
            })
            if ( order.products.every(product=> product.productStatus === 'cancelled') ){
              order.orderStatus = 'cancelled'
            }else{
              order.orderTotal = action.payload.updatedOrder.orderTotal
              order.absoluteTotalWithTaxes = action.payload.updatedOrder.absoluteTotalWithTaxes
            }
          }
          return order
        })
      })
      .addCase(cancelOrderProduct.pending, (state)=> {
        state.loading = true
        state.orderError = null
      })
      .addCase(cancelOrderProduct.rejected, (state, action)=> {
        console.log('cancelOrderProduct rejected:', action.payload)
        state.loading = false
        state.orderError = action.payload
        state.productCancelled = false
      })
      .addCase(deleteProductFromOrderHistory.fulfilled, (state, action) => {
        console.log('deleteProductFromOrderHistory fulfilled:', action.payload)
        state.orderError = null
        state.loading = false
        state.productDeleted = true
        state.orderMessage = action.payload.message

        state.orders = state.orders.map(order=> {
          if(order._id === action.payload.orderId){
            order.products = order.products.map(product=> {
              if(product.productId === action.payload.productId){
                product.isDeleted = true
              }
              return product
            })
          }
          return order
        })
      })
      .addCase(deleteProductFromOrderHistory.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(deleteProductFromOrderHistory.rejected, (state, action) => {
        console.log('deleteProductFromOrderHistory rejected:', action.payload)
        state.loading = false
        state.orderError = true
        state.orderMessage = action.payload.message
        state.productDeleted  = false
      })
      .addCase(changeOrderStatus.fulfilled, (state, action)=> { 
        console.log('changeOrderStatus fulfilled:', action.payload)
        state.orderError = null
        state.loading = false
        state.orderUpdated = true
        state.orderMessage = action.payload.message

        state.orders = state.orders.map(order=> {
          if(order._id === action.payload.orderId){
            order.orderStatus = action.payload.updatedOrder.orderStatus
            order.products = order.products.map(product=> {
              product.productStatus = action.payload.updatedOrder.orderStatus
              return product
            })
          } 
          return order
        })
      })
      .addCase(changeOrderStatus.pending, (state)=> {
        state.loading = true
        state.orderError = null
      })
      .addCase(changeOrderStatus.rejected, (state, action)=> {
        console.log('changeProductStatus rejected:', action.payload)
        state.loading = false
        state.orderError = true
        state.orderMessage = action.payload.message
        state.orderUpdated = false
      })
      .addCase(changeProductStatus.fulfilled, (state, action)=> { 
        console.log('changeProductStatus fulfilled:', action.payload)
        state.orderError = null
        state.loading = false
        state.orderUpdated = true
        state.orderMessage = action.payload.message

        state.orders = state.orders.map(order=> {
          if(order._id === action.payload.orderId){
            const requiredStatus = action.payload.updatedProduct.productStatus
            order.products = order.products.map(product=> {
              if(product.productId === action.payload.productId){
                product.productStatus = requiredStatus
              }
              return product
            })
            if(order.products.every(product=> product.productStatus === requiredStatus)){
              order.orderStatus = requiredStatus
            }
          } 
          return order
        })
      })
      .addCase(changeProductStatus.pending, (state)=> {
        state.loading = true
        state.orderError = null
      })
      .addCase(changeProductStatus.rejected, (state, action)=> {
        console.log('changeProductStatus rejected:', action.payload)
        state.loading = false
        state.orderError = true
        state.orderMessage = action.payload.message
        state.orderUpdated = false
      })
    }
})
  
export default orderSlice.reducer
export const {resetOrderStates} = orderSlice.actions
