import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const createOffer = createAsyncThunk('offer/add', async ({offerDetails}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/offers/add', offerDetails, {headers: {'Content-Type': 'multipart/form-data'}})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getAllOffers = createAsyncThunk('offer/list', async ({queryOptions}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/offers/list', {queryOptions})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateOffer = createAsyncThunk('offer/update', async ({offerDetails, offerId}, thunkAPI)=> {
  try {
    const response = await apiClient.post(`/offers/update/${offerId}`, offerDetails, {headers: {'Content-Type': 'multipart/form-data'}})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const deleteOffer = createAsyncThunk('offer/delete', async ({offerId}, thunkAPI)=> {
  try {
    const response = await apiClient.delete(`/offers/delete/${offerId}`)
    return {offerId, message: response.data.message}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const searchOffers = createAsyncThunk('offer/search', async ({query}, thunkAPI)=> {
  try {
    const response = await apiClient.get(`/offers/?query=${query}`)
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getBestOffer = createAsyncThunk('offer/getBestOffer', async ({productId, quantity}, thunkAPI)=> {
  try {
    const response = await apiClient.post('/offers/bestOffers', {productId, quantity})
    return response.data
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const toggleOfferStatus = createAsyncThunk('offer/toggleOfferStatus', async ({offerId}, thunkAPI)=> {
  try {
    const response = await apiClient.patch(`/offers/toggle-status/${offerId}`)
    return {offerId, message: response.data.message}
  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
    return thunkAPI.rejectWithValue(errorMessage)
  }
})


const initialState = {
    offers: [], 
    bestOffer: {},
    offerCreated: false,
    offerRemoved: false,
    offerUpdated: false,
    offerToggled: false,
    totalOffers: null,
    loading: false,
    offerMessage: null,
    offerError: null,
}

const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    resetOfferStates: (state)=> {
      state.loading = false
      state.offerError = null
      state.offerCreated = false
      state.offerRemoved = false
      state.offerUpdated = false
    }
  },
  extraReducers: (builder)=> {
    builder
      .addCase(createOffer.fulfilled, (state, action)=> {
        state.offerError = null
        state.loading = false
        state.offerCreated = true
        state.offers.push(action.payload.offer)
      })
      .addCase(createOffer.pending, (state)=> {
        state.loading = true
        state.offerError = null
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(getAllOffers.fulfilled, (state, action)=> {
        state.offerError = null
        state.loading = false
        state.offers = action.payload.offers
        state.totalOffers = action.payload.totalOffers
      })
      .addCase(getAllOffers.pending, (state)=> {
        state.loading = true
        state.offerError = null
      })
      .addCase(getAllOffers.rejected, (state, action) => {
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(updateOffer.fulfilled, (state, action)=> {
        state.offerError = null
        state.loading = false
        state.offerUpdated = true
        state.offers = state.offers.map(offer=> {
          if(offer._id === action.payload.offer._id){
            return action.payload.offer
          }
          return offer
        })
      })
      .addCase(updateOffer.pending, (state)=> {
        state.loading = true
        state.offerError = null
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(deleteOffer.fulfilled, (state, action)=> {
        state.offerError = null
        state.loading = false
        state.offerRemoved = true
        state.offers = state.offers.filter(offer=> offer._id != action.payload.offerId)
      })
      .addCase(deleteOffer.pending, (state)=> {
        state.loading = true
        state.offerError = null
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(searchOffers.fulfilled, (state, action)=> {
        state.offerError = null
        state.loading = false
        state.offers = action.payload.offers
      })
      .addCase(searchOffers.pending, (state)=> {
        state.loading = true
        state.offerError = null
      })
      .addCase(searchOffers.rejected, (state, action) => {
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(getBestOffer.fulfilled, (state, action)=> {
        state.offerError = null
        state.bestOffer = action.payload.bestOffer
        state.offerMessage = action.payload.message
      })
      .addCase(getBestOffer.pending, (state)=> {
        state.offerError = null
      })
      .addCase(getBestOffer.rejected, (state, action) => {
        state.offerError = action.payload
      })
      .addCase(toggleOfferStatus.fulfilled, (state, action)=> {
        state.offerError = null
        state.offerToggled = true
        state.offers = state.offers.map(offer=> {
          if(offer._id === action.payload.offerId){
            offer.status = offer.status === "active" ? "deactivated" : "active"
          }
          return offer
        })
      })
      .addCase(toggleOfferStatus.pending, (state)=> {
        state.offerError = null
      })
      .addCase(toggleOfferStatus.rejected, (state, action) => {
        state.offerError = action.payload
        state.offerToggled = false
      })
    }
})
  
export default offerSlice.reducer
export const {resetOfferStates} = offerSlice.actions
