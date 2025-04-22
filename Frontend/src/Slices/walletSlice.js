import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const getOrCreateWallet = createAsyncThunk('wallet/getOrCreateWallet', async (thunkAPI)=> {
  try {
    console.log('Inside getOrCreateWallet createAsyncThunk');
    // console.log("getOrCreateWallet from walletSlice---->", orderDetails)
    const response = await axios.get('/wallet', {withCredentials: true})
    console.log('Returning success response from getOrCreateWallet...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of getOrCreateWallet')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const addFundsToWallet = createAsyncThunk('wallet/addFundsToWallet', async ({paymentDetails}, thunkAPI)=> {
  try {
    console.log('Inside addFundsToWallet createAsyncThunk');
    console.log("addFundsToWallet from walletSlice---->", paymentDetails)
    const response = await axios.post('/wallet/add', {paymentDetails}, {withCredentials: true})
    console.log('Returning success response from addFundsToWallet...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of addFundsToWallet')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})


const initialState = {
  safeWallet: {}, 
  balance: 0,
  walletCreated: false,
  walletUpdated: false,
  walletLoading: false,
  walletError: null,
  walletMessage: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWalletStates: (state) => {
      state.walletLoading = false
      state.walletError = null
      state.walletMessage = null
      state.walletSuccess = false
      state.walletCreated = false
      state.walletUpdated = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrCreateWallet.fulfilled, (state, action) => {
        console.log('getOrCreateWallet fulfilled:', action.payload)
        state.walletError = null
        state.walletLoading = false
        state.walletMessage = action.payload.message
        state.safeWallet = action.payload.safeWallet
      })
      .addCase(getOrCreateWallet.pending, (state) => {
        state.walletLoading = true
        state.walletError = null
      })
      .addCase(getOrCreateWallet.rejected, (state, action) => {
        console.log('getOrCreateWallet rejected:', action.payload)
        state.walletLoading = false
        state.walletError = action.payload
        state.walletMessage = action.payload.message
      })
      .addCase(addFundsToWallet.fulfilled, (state, action) => {
        console.log('addFundsToWallet fulfilled:', action.payload)
        state.walletError = null
        state.walletLoading = false
        state.walletMessage = action.payload.message
        state.safeWallet = action.payload.safeWallet
      })
      .addCase(addFundsToWallet.pending, (state) => {
        state.walletLoading = true
        state.walletError = null
      })
      .addCase(addFundsToWallet.rejected, (state, action) => {
        console.log('addFundsToWallet rejected:', action.payload)
        state.walletLoading = false
        state.walletError = action.payload
        state.walletMessage = action.payload.message
      })
      
    }
})
  
export default walletSlice.reducer
export const {resetWalletStates} = walletSlice.actions
