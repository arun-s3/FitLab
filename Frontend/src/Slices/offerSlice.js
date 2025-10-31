import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createOffer = createAsyncThunk('offer/add', async ({offerDetails}, thunkAPI)=> {
  try {
    console.log('Inside createOffer createAsyncThunk')
    console.log("offerDetails from offerSlice---->", offerDetails)
    const response = await axios.post('/offers/add', offerDetails, {headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true})
    console.log('Returning success response from createOffer...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of createOffer')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getAllOffers = createAsyncThunk('offer/list', async ({queryOptions}, thunkAPI)=> {
  try {
    console.log('Inside getAllOffers createAsyncThunk')
    console.log("offerDetails from offerSlice---->", queryOptions)
    const response = await axios.post('/offers/list', {queryOptions}, {withCredentials: true})
    console.log('Returning success response from getAllOffers...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of averageRating')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateOffer = createAsyncThunk('offer/update', async ({offerDetails, offerId}, thunkAPI)=> {
  try {
    console.log('Inside updateOffer createAsyncThunk')
    console.log("offerDetails from offerSlice---->", offerDetails)
    const response = await axios.post(`/offers/update/${offerId}`, {offerDetails}, {withCredentials: true})
    console.log('Returning success response from updateOffer...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of updateOffer')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const deleteOffer = createAsyncThunk('offer/delete', async ({offerId}, thunkAPI)=> {
  try {
    console.log('Inside deleteOffer createAsyncThunk')
    console.log("offerId from offerSlice---->", offerId)
    const response = await axios.delete(`/offers/delete/${offerId}`, {withCredentials: true})
    console.log('Returning success response from deleteOffer...', JSON.stringify(response.data))
    return {offerId, message: response.data.message}
  }catch(error){
    console.log('Inside catch of deleteOffer')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const searchOffers = createAsyncThunk('offer/search', async ({query}, thunkAPI)=> {
  try {
    console.log('Inside searchOffers createAsyncThunk')
    console.log("query from offerSlice---->", query)
    const response = await axios.get(`/offers/?query=${query}`, {withCredentials: true})
    console.log('Returning success response from searchOffers...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of searchOffers')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const getBestOffer = createAsyncThunk('offer/getBestOffer', async ({productId, quantity}, thunkAPI)=> {
  try {
    console.log('Inside getBestOffer createAsyncThunk')
    const response = await axios.post('/offers/bestOffers', {productId, quantity}, {withCredentials: true})
    console.log('Returning success response from getBestOffer...', JSON.stringify(response.data))
    return response.data
  }catch(error){
    console.log('Inside catch of getBestOffer')
    const errorMessage = error.response?.data?.message
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const toggleOfferStatus = createAsyncThunk('offer/toggleOfferStatus', async ({offerId}, thunkAPI)=> {
  try {
    console.log('Inside toggleOfferStatus createAsyncThunk')
    const response = await axios.patch(`/offers/toggle-status/${offerId}`, {withCredentials: true})
    console.log('Returning success response from toggleOfferStatus...', JSON.stringify(response.data))
    return {offerId, message: response.data.message}
  }catch(error){
    console.log('Inside catch of toggleOfferStatus')
    const errorMessage = error.response?.data?.message
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
        console.log('createOffer fulfilled:', action.payload)
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
        console.log('createOffer rejected:', action.payload)
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(getAllOffers.fulfilled, (state, action)=> {
        console.log('getAllOffers fulfilled:', action.payload)
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
        console.log('getAllOffers rejected:', action.payload)
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(updateOffer.fulfilled, (state, action)=> {
        console.log('updateOffer fulfilled:', action.payload)
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
        console.log('updateOffer rejected:', action.payload)
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(deleteOffer.fulfilled, (state, action)=> {
        console.log('deleteOffer fulfilled:', action.payload)
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
        console.log('deleteOffer rejected:', action.payload)
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(searchOffers.fulfilled, (state, action)=> {
        console.log('searchOffers fulfilled:', action.payload)
        state.offerError = null
        state.loading = false
        state.offers = action.payload.offers
      })
      .addCase(searchOffers.pending, (state)=> {
        state.loading = true
        state.offerError = null
      })
      .addCase(searchOffers.rejected, (state, action) => {
        console.log('searchOffers rejected:', action.payload)
        state.loading = false
        state.offerError = action.payload
      })
      .addCase(getBestOffer.fulfilled, (state, action)=> {
        console.log('getBestOffer fulfilled:', action.payload)
        state.offerError = null
        state.bestOffer = action.payload.bestOffer
        state.offerMessage = action.payload.message
      })
      .addCase(getBestOffer.pending, (state)=> {
        state.offerError = null
      })
      .addCase(getBestOffer.rejected, (state, action) => {
        console.log('getBestOffer rejected:', action.payload)
        state.offerError = action.payload
      })
      .addCase(toggleOfferStatus.fulfilled, (state, action)=> {
        console.log('toggleOfferStatus fulfilled:', action.payload)
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
        console.log('toggleOfferStatus rejected:', action.payload)
        state.offerError = action.payload
        state.offerToggled = false
      })
    }
})
  
export default offerSlice.reducer
export const {resetOfferStates} = offerSlice.actions
