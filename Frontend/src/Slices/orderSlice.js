import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const createOrder = createAsyncThunk('order/createOrder', async ({orderDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/order/add', {orderDetails})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getOrders = createAsyncThunk('order/getOrders', async ({queryDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/order', {queryDetails})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getAllUsersOrders = createAsyncThunk('order/getAllUsersOrders', async ({queryDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/order/all', {queryDetails})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const cancelOrder = createAsyncThunk('order/cancelOrder', async ({orderId, orderCancelReason}, thunkAPI)=> {
  try {
    const response = await apiClient.patch(`/order/cancel/${orderId}`,{orderCancelReason})
    return {orderId, cart: response.data.order}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const cancelOrderProduct = createAsyncThunk('order/cancelOrderProduct', async ({orderId, productId, productCancelReason}, thunkAPI)=> {
    try {
      const response = await apiClient.patch(`/order/cancel`, {orderId, productId, productCancelReason})
      return {orderId, productId, updatedOrder: response.data.order, message: response.data.message}
    }catch(error) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const deleteProductFromOrderHistory = createAsyncThunk('order/deleteProductFromOrderHistory', async ({orderId, productId}, thunkAPI)=> {
  try {
    const response = await apiClient.post(`/order/delete/${orderId}`, {productId})
    return {orderId, productId, updatedOrder: response.data.order, message: response.data.message}
  }catch(error) {
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
}
)

export const changeOrderStatus = createAsyncThunk('order/changeOrderStatus', async ({orderId, newStatus}, thunkAPI)=> {
  try {
    const response = await apiClient.patch(`/order/status/${orderId}`,{newStatus})
    return {orderId, updatedOrder: response.data.updatedOrder}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const changeProductStatus = createAsyncThunk('order/changeProductStatus', async ({orderId, productId, newProductStatus}, thunkAPI)=> {
  try {
    const response = await apiClient.patch(`/order/status/${orderId}/products/${productId}`,{newProductStatus})
    return {orderId, productId, updatedProduct: response.data.updatedProduct, order: response.data.order}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const initiateReturn = createAsyncThunk(
  'order/initiateReturn',
  async ({ orderId, productId, returnType, returnReason, formData }, thunkAPI) => {
    try {
      const response = await apiClient.post('/order/return', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      return { orderId, productId, returnType, returnReason }
    }catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const handleReturnDecision = createAsyncThunk('order/handleReturnDecision', async ({returnDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post(`order/return/decision`, {returnDetails})
    return {...returnDetails}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const cancelReturnRequest = createAsyncThunk('order/cancelReturnRequest', async ({returnDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post(`order/return/cancel`, {returnDetails})
    return {...returnDetails}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const processRefund = createAsyncThunk('order/processRefund', async ({refundInfos}, thunkAPI)=> {
  try {
    const response = await apiClient.post(`order/refund`, {refundInfos})
    return {...refundInfos}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})


const initialState = {
  orders: [], 
  orderCreated: false,
  OrderRemoved: false,
  orderCancelled: false,
  orderReturnRequested: true,
  orderUpdated: false,
  handledOrderDecision: false,
  canceledReturnRequest: false,
  refundSuccess: false, 
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
      state.orderReturnRequested = false
      state.handledOrderDecision = false
      state.canceledReturnRequest = false
      state.refundSuccess = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
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
        state.loading = false
        state.orderError = action.payload
        state.orderMessage = action.payload.message
        state.orderSuccess = false
      })
      .addCase(getOrders.fulfilled, (state, action) => {
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
        state.loading = false
        state.orderError = action.payload
        state.orderMessage = action.payload.message
        state.orderSuccess = false 
      })
      .addCase(getAllUsersOrders.fulfilled, (state, action) => {
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
        state.loading = false
        state.orderError = action.payload
        state.orderMessage = action.payload.message
        state.orderSuccess = false 
      })
      .addCase(cancelOrder.fulfilled, (state, action) => { 
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
        state.loading = false
        state.orderError = true
        state.orderMessage = action.payload.message
        state.orderCancelled = false
      })
      .addCase(cancelOrderProduct.fulfilled, (state, action) => {
        state.orderError = null;
        state.loading = false;
        state.productCancelled = true;
        state.orderMessage = action.payload.message;

        state.orders = state.orders.map((order)=> {
          if (order._id === action.payload.orderId){
            order.products = order.products.map(product=> {
              if(product.productId._id === action.payload.productId){
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
        state.loading = false
        state.orderError = action.payload
        state.productCancelled = false
      })
      .addCase(deleteProductFromOrderHistory.fulfilled, (state, action) => {
        state.orderError = null
        state.loading = false
        state.productDeleted = true
        state.orderMessage = action.payload.message

        state.orders = state.orders.map((order) => {
    if (order._id === action.payload.orderId) {
      return {
        ...order,
        products: order.products.map((product) => {
          if (product.productId._id.toString() === action.payload.productId.toString()) {
            return { ...product, isDeleted: true };
          }
          return product;
        }),
      };
    }
    return order;
  });
      })
      .addCase(deleteProductFromOrderHistory.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(deleteProductFromOrderHistory.rejected, (state, action) => {
        state.loading = false
        state.orderError = true
        state.orderMessage = action.payload.message
        state.productDeleted  = false
      })
      .addCase(changeOrderStatus.fulfilled, (state, action)=> { 
        state.orderError = null
        state.loading = false
        state.orderUpdated = true
        state.orderMessage = action.payload.message

        state.orders = state.orders.map(order=> {

          if(order._id === action.payload.orderId){
            order.orderStatus = action.payload.updatedOrder.orderStatus

            if(action.payload.updatedOrder.orderStatus === 'delivered'){
              order.deliveryDate = action.payload.updatedOrder.deliveryDate

              if(order.paymentDetails.paymentMethod === 'cashOnDelivery'){
                order.paymentDetails.paymentStatus = 'completed'
              }
            }
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
        state.loading = false
        state.orderError = true
        state.orderMessage = action.payload.message
        state.orderUpdated = false
      })
      .addCase(changeProductStatus.fulfilled, (state, action)=> { 
        state.orderError = null
        state.loading = false
        state.orderUpdated = true
        state.orderMessage = action.payload.message

        state.orders = state.orders.map(order=> {

          if(order._id === action.payload.orderId){
            const requiredStatus = action.payload.updatedProduct.productStatus
            order.products = order.products.map(product=> {

              if(product.productId._id === action.payload.productId){
                product.productStatus = requiredStatus

                if(requiredStatus === 'delivered'){
                  const otherDeliveredProducts = order.products.find(product=> product.productStatus === 'delivered')

                  if(!otherDeliveredProducts){
                    order.orderStatus = 'delivered'
                    order.deliveryDate = action.payload.order.deliveryDate
                    if(order.paymentDetails.paymentMethod === 'cashOnDelivery'){
                      order.paymentDetails.paymentStatus = 'completed'
                    }
                  }
                }
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
        state.loading = false
        state.orderError = true
        state.orderMessage = action.payload.message
        state.orderUpdated = false
      })
      .addCase(initiateReturn.fulfilled, (state, action) => {
        state.orderError = null
        state.loading = false
        state.orderSuccess = true
        state.orderReturnRequested = true

        if (state.orders && state.orders.length > 0) {
          const order = state.orders.find(o => o._id === action.payload.orderId)
          if (order) {
            if (action.payload.returnType === 'product') {
              const product = order.products.find(p => p.productId._id === action.payload.productId)
              if (product) {
                product.productStatus = 'returning'
                product.productReturnReason = action.payload.returnReason
              }
            } else if(action.payload.returnType === 'order') {
              order.orderStatus = 'returning'
              order.orderReturnReason = action.payload.returnReason
              order.products.forEach(p => p.productStatus = 'returning')
            }
          }
        }
      })
      .addCase(initiateReturn.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(initiateReturn.rejected, (state, action) => {
        state.loading = false
        state.orderError = action.payload
        state.orderSuccess = false
      })
      .addCase(handleReturnDecision.fulfilled, (state, action) => {
        state.loading = false
        state.orderError = null
        state.orderSuccess = true
        state.handledOrderDecision = true

        const { orderId, productId, returnType, didAccept } = action.payload

        if (state.orders && state.orders.length > 0) {
          const order = state.orders.find(o => o._id === orderId)
          if (order) {
            const decision = didAccept ? 'accepted' : 'rejected'
          
            if (returnType === 'product') {
              const product = order.products.find(p => p.productId._id === productId)
              if (product) {
                product.productReturnStatus = decision
                if(!didAccept){
                  product.productStatus = 'delivered'
                }
                
                const allAccepted = order.products.every(
                  p => p.productReturnStatus === 'accepted' 
                )
                const allRejected = order.products.every(
                  p => p.productReturnStatus === 'rejected' 
                )
              
                if (allAccepted) {
                  order.orderReturnStatus = 'accepted'
                } else if (allRejected) {
                  order.orderReturnStatus = 'rejected'
                  order.orderStatus = 'delivered'
                }
              }
            }
          
            else if (returnType === 'order') {
              order.orderReturnStatus = decision
              if(!didAccept){
                order.orderStatus ='delivered'
              }            
              order.products.forEach(p => {
                p.productReturnStatus = decision
                if(!didAccept){
                  p.productStatus ='delivered'
                }  
              })
            }
          }
        }
      })
      .addCase(handleReturnDecision.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(handleReturnDecision.rejected, (state, action) => {
        state.loading = false
        state.orderError = action.payload
        state.orderSuccess = false
        state.handledOrderDecision = false
      })
      .addCase(cancelReturnRequest.fulfilled, (state, action) => {
        state.orderError = null
        state.loading = false
        state.orderSuccess = true
        state.canceledReturnRequest = true

        const {orderId, productId, returnType} = action.payload

        if (state.orders && state.orders.length > 0){
          const order = state.orders.find(o => o._id === orderId)
          if (order) {
            if (returnType === 'product') {
              const product = order.products.find(p => p.productId._id === productId)
              if (product) {
                product.productStatus = 'delivered'
                product.productReturnReason = null
                product.productReturnImages = null
                product.productReturnStatus = null
              }
            
              const anyReturning = order.products.some(p => p.productStatus === 'returning')
              if (!anyReturning) {
                order.orderStatus = 'delivered'
                order.orderReturnReason = null
                order.orderReturnImages = null
                order.orderReturnStatus = null
              }
            } 
            else if (returnType === 'order') {
              order.orderStatus = 'delivered'
              order.orderReturnReason = null
              order.orderReturnImages = null
              order.orderReturnStatus = null

              order.products.forEach(p => {
                if (p.productStatus === 'returning') {
                  p.productStatus = 'delivered'
                  p.productReturnReason = null
                  p.productReturnImages = null
                  p.productReturnStatus = null
                }
              })
            }
          }
        }
      })
      .addCase(cancelReturnRequest.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(cancelReturnRequest.rejected, (state, action) => {
        state.loading = false
        state.orderError = action.payload
        state.orderSuccess = false
        state.canceledReturnRequest = false
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.orderError = null
        state.loading = false
        state.refundSuccess = true

        if (state.orders && state.orders.length > 0) {
          const order = state.orders.find(o => o._id === action.payload.orderId)

          if (order) {
            if (action.payload.refundType === 'product') {
              const product = order.products.find(p => p.productId._id === action.payload.productId)
              if (product) {
                product.productStatus = 'refunded'
              }
            
              const allRefunded = order.products.every(p => p.productStatus === 'refunded')
              if (allRefunded) {
                order.orderStatus = 'refunded'
              }
            }
          
            else if (action.payload.refundType === 'order') {
              order.orderStatus = 'refunded'
              order.products.forEach(p => (p.productStatus = 'refunded'))
            }
          }
        }
      })
      .addCase(processRefund.pending, (state) => {
        state.loading = true
        state.orderError = null
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.loading = false
        state.orderError = action.payload
        state.orderSuccess = false
        state.refundSuccess = false
      })

    }
})
  
export default orderSlice.reducer
export const {resetOrderStates} = orderSlice.actions
