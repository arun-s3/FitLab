import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const getOrCreateWallet = createAsyncThunk('wallet/getOrCreateWallet', async ({queryOptions}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wallet', {queryOptions})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const addFundsToWallet = createAsyncThunk('wallet/addFundsToWallet', async ({paymentDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wallet/add', {paymentDetails})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const addPeerAccount = createAsyncThunk('wallet/peer-account', async ({accountDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wallet/peer-account', {accountDetails})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const sendMoneyToUser = createAsyncThunk('wallet/sendMoneyToUser', async ({paymentDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wallet/send', {paymentDetails})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const requestMoneyFromUser = createAsyncThunk('wallet/requestMoneyFromUser', async ({paymentDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wallet/request', {paymentDetails})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const confirmMoneyRequest = createAsyncThunk('wallet/confirmMoneyRequest', async ({transaction_id}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wallet/request-confirm', {transaction_id})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const declineMoneyRequest = createAsyncThunk('wallet/declineMoneyRequest', async ({transaction_id}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wallet/request-decline', {transaction_id})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateAutoRechargeSettings = createAsyncThunk('wallet/updateAutoRechargeSettings', async ({settings}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/wallet/recharge-settings', {settings})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
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
  walletSettingsUpdated: false,
  stripeClientSecret: null,
  transactionsCount: null,
  walletLoading: false,
  walletError: '',
  walletMessage: null,
}

const handleAsyncThunkCases = (builder, asyncThunk) => {
  builder
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state.walletError = null
      state.walletLoading = false
      state.walletMessage = action.payload.message
      state.safeWallet = action.payload.safeWallet

      if(asyncThunk === getOrCreateWallet){
        state.transactionsCount = action.payload.transactionsCount
      }
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
      if(asyncThunk === updateAutoRechargeSettings){
        state.walletUpdated = true
        state.walletSettingsUpdated = true 
        if(action.payload.paymentMethod === 'stripe'){
          state.stripeClientSecret = action.payload.stripeClientSecret
        }
      }
    })
    .addCase(asyncThunk.pending, (state) => {
      state.walletLoading = true
      state.walletError = null
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      state.walletLoading = false
      state.walletError = action.payload
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
      state.walletSettingsUpdated = false
      state.stripeClientSecret = null
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
    handleAsyncThunkCases(builder, updateAutoRechargeSettings)
    }
})
  

export default walletSlice.reducer
export const {resetWalletStates} = walletSlice.actions
