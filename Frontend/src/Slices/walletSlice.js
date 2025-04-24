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

export const addBeneficiaryAccount = createAsyncThunk('wallet/addBeneficiaryAccount', async ({accountDetails}, thunkAPI)=> {
  try {
    console.log('Inside addBeneficiaryAccount createAsyncThunk')
    console.log("addBeneficiaryAccount from walletSlice---->", accountDetails)
    const response = await axios.post('/wallet/beneficiary', {accountDetails}, {withCredentials: true})
    console.log('Returning success response from addBeneficiaryAccount...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of addBeneficiaryAccount')
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


const initialState = {
  safeWallet: {}, 
  balance: 0,
  moneySent: false,
  moneyRequested: false,
  beneficiaryAdded: true,
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
      state.beneficiaryAdded = false
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
    handleAsyncThunkCases(builder, addBeneficiaryAccount)
    }
})
  

export default walletSlice.reducer
export const {resetWalletStates} = walletSlice.actions
