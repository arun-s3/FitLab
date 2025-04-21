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


const initialState = {
  safeWallet: {}, 
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
      
    }
})
  
export default walletSlice.reducer
export const {resetWalletStates} = walletSlice.actions
