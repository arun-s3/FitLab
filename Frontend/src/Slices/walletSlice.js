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

export const addPeerAccount = createAsyncThunk('wallet/peer-account', async ({accountDetails}, thunkAPI)=> {
  try {
    console.log('Inside addPeerAccount createAsyncThunk')
    console.log("addPeerAccount from walletSlice---->", accountDetails)
    const response = await axios.post('/wallet/peer-account', {accountDetails}, {withCredentials: true})
    console.log('Returning success response from addPeerAccount...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of addPeerAccount')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const sendMoneyToUser = createAsyncThunk('wallet/sendMoneyToUser', async ({paymentDetails}, thunkAPI)=> {
  try {
    console.log('Inside sendMoneyToUser createAsyncThunk');
    console.log("sendMoneyToUser from walletSlice---->", paymentDetails)
    const response = await axios.post('/wallet/send', {paymentDetails}, {withCredentials: true})
    console.log('Returning success response from sendMoneyToUser...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of sendMoneyToUser')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const requestMoneyFromUser = createAsyncThunk('wallet/requestMoneyFromUser', async ({paymentDetails}, thunkAPI)=> {
  try {
    console.log('Inside requestMoneyFromUser createAsyncThunk');
    console.log("requestMoneyFromUser from walletSlice---->", paymentDetails)
    const response = await axios.post('/wallet/request', {paymentDetails}, {withCredentials: true})
    console.log('Returning success response from requestMoneyFromUser...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of requestMoneyFromUser')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const confirmMoneyRequest = createAsyncThunk('wallet/confirmMoneyRequest', async ({transaction_id}, thunkAPI)=> {
  try {
    console.log('Inside confirmMoneyRequest createAsyncThunk');
    console.log("confirmMoneyRequest from walletSlice---->", transaction_id)
    const response = await axios.post('/wallet/request-confirm', {transaction_id}, {withCredentials: true})
    console.log('Returning success response from confirmMoneyRequest...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of confirmMoneyRequest')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const declineMoneyRequest = createAsyncThunk('wallet/declineMoneyRequest', async ({transaction_id}, thunkAPI)=> {
  try {
    console.log('Inside declineMoneyRequest createAsyncThunk');
    console.log("declineMoneyRequest from walletSlice---->", transaction_id)
    const response = await axios.post('/wallet/request-decline', {transaction_id}, {withCredentials: true})
    console.log('Returning success response from declineMoneyRequest...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of declineMoneyRequest')
    const errorMessage = error.response?.data?.message
    console.log('Error object inside createAsyncThunk', JSON.stringify(error.response))
    console.log("error object inside createAsyncThunk error.response.data.message-->", JSON.stringify(error.response.data.message))
    return thunkAPI.rejectWithValue(errorMessage)
  }
})


const initialState = {
  safeWallet: {}, 
  balance: 0,
  moneySent: false,
  moneyRequested: false,
  moneyRequestConfirmed: false,
  moneyRequestDeclined: false,
  peerAccountAdded: true,
  walletCreated: false,
  walletUpdated: false,
  walletLoading: false,
  walletError: '',
  walletMessage: null,
}

const handleAsyncThunkCases = (builder, asyncThunk) => {
  builder
    .addCase(asyncThunk.fulfilled, (state, action) => {
      console.log(`${asyncThunk.typePrefix} fulfilled:`, action.payload)
      state.walletError = null
      state.walletLoading = false
      state.walletMessage = action.payload.message
      state.safeWallet = action.payload.safeWallet
      if(asyncThunk === sendMoneyToUser){
        state.moneySent = true
      }
      if(asyncThunk === requestMoneyFromUser){
        state.moneyRequested = true
      }
      if(asyncThunk === confirmMoneyRequest){
        state.moneyRequestConfirmed = true
      }
      if(asyncThunk === declineMoneyRequest){
        state.moneyRequestDeclined = true
      }
    })
    .addCase(asyncThunk.pending, (state) => {
      state.walletLoading = true
      state.walletError = null
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      console.log(`${asyncThunk.typePrefix} rejected:`, action.payload)
      state.walletLoading = false
      state.walletError = action.payload
      // state.walletMessage = action.payload.message
    })
}


const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWalletStates: (state) => {
      state.moneySent = false
      state.moneyRequested = false 
      state.moneyRequestConfirmed = false
      state.moneyRequestDeclined = false
      state.peerAccountAdded = false
      state.walletLoading = false
      state.walletError = null
      state.walletMessage = null
      state.walletSuccess = false
      state.walletCreated = false
      state.walletUpdated = false
    }
  },
  extraReducers: (builder) => {
    handleAsyncThunkCases(builder, getOrCreateWallet)
    handleAsyncThunkCases(builder, addFundsToWallet)
    handleAsyncThunkCases(builder, sendMoneyToUser)
    handleAsyncThunkCases(builder, requestMoneyFromUser)
    handleAsyncThunkCases(builder, confirmMoneyRequest) 
    handleAsyncThunkCases(builder, declineMoneyRequest)
    handleAsyncThunkCases(builder, addPeerAccount)
    }
})
  

export default walletSlice.reducer
export const {resetWalletStates} = walletSlice.actions
