import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const createNewAddress = createAsyncThunk('createNewAddress', async({id, addressData}, thunkAPI)=>{
    try{
        const response = await apiClient.post(`addresses/new/${id}`, {addressData})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while adding new address. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const editAddress = createAsyncThunk('editAddress', async({id, addressId, addressData}, thunkAPI)=>{
    try{
        const response = await apiClient.post(`addresses/edit/${id}`, {addressData, addressId})
        return {id, addressId, address: response.data.address}
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while updating address. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const deleteAddress = createAsyncThunk('deleteAddress', async({addressId}, thunkAPI)=>{
    try{
        const response = await apiClient.delete(`addresses/delete/${addressId}`)
        return {addressId, message: response.data.message}
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while deleting address. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getAllAddress = createAsyncThunk('getAllAddress', async(_, thunkAPI)=>{
    try{
        const response = await apiClient.get('addresses')
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while loading address. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getDefaultAddress = createAsyncThunk('getDefaultAddress', async({id}, thunkAPI)=>{
    try{
        const response = await apiClient.get(`addresses/${id}/default`)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const setAsDefaultAddress = createAsyncThunk('setAsDefaultAddress', async({addressId}, thunkAPI)=>{
    try{
        const response = await apiClient.put(`addresses/setAsDefault/${addressId}`)
        return {addressId, message: response.data.message}
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while setting default address. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})


const initialState = {
    currentDefaultAddress: {},
    addressCreated: false,
    addressUpdated: false,
    addressDeleted: false,
    loading: false,
    error: null,
    success:false,
    message: null,
}

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        resetStates: (state, action)=>{
            state.loading = false
            state.error = null
            state.message = false
            state.success = false
            state.addressCreated = false
            state.addressUpdated = false
            state.addressDeleted = false
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(createNewAddress.fulfilled, (state, action)=>{
            state.error = null
            state.addressCreated = true
            state.loading = false
            state.addresses.push(action.payload.address)
        })
        .addCase(createNewAddress.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(createNewAddress.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(editAddress.fulfilled, (state, action)=>{
            state.error = null
            state.addressUpdated = true
            state.loading = false
            const index = state.addresses.findIndex(address=> address._id === action.payload.addressId)
            state.addresses[index] = action.payload.address
        })
        .addCase(editAddress.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(editAddress.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(deleteAddress.fulfilled, (state, action)=>{
            state.error = null
            state.loading = false
            state.addressDeleted = true
            state.message = action.payload.message
            state.addresses = state.addresses.filter(address=> address._id !== action.payload.addressId)
        })
        .addCase(deleteAddress.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(deleteAddress.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(getAllAddress.fulfilled, (state, action)=>{
            state.error = null
            state.success = true
            state.loading = false
            state.addresses = action.payload.addresses
        })
        .addCase(getAllAddress.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(getAllAddress.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(getDefaultAddress.fulfilled, (state, action)=>{
            state.error = null
            state.success = true
            state.loading = false
            state.currentDefaultAddress = action.payload.address
        })
        .addCase(getDefaultAddress.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(getDefaultAddress.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(setAsDefaultAddress.fulfilled, (state, action)=>{
            state.error = null
            state.success = true
            state.loading = false
            state.message = action.payload.message
            state.addresses = state.addresses.map(address=> {
                if(address._id === action.payload.addressId){
                    return {...address, defaultAddress: true}
                }else{
                    return {...address, defaultAddress: false}
                }
            })
        })
        .addCase(setAsDefaultAddress.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(setAsDefaultAddress.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
    }
})

export default addressSlice.reducer
export const {resetStates} = addressSlice.actions
