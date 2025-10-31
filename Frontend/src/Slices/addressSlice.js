import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createNewAddress = createAsyncThunk('createNewAddress', async({id, addressData}, thunkAPI)=>{
    try{
        console.log("Inside createNewAddress createAsyncThunk")
        const response = await axios.post(`addresses/new/${id}`, {addressData}, {withCredentials:true})
        console.log("returning success response from createNewAddress createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createNewAddress from addressSlice")
        const errorMessage = error.response?.data?.message
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const editAddress = createAsyncThunk('editAddress', async({id, addressId, addressData}, thunkAPI)=>{
    try{
        console.log("Inside editAddress createAsyncThunk")
        const response = await axios.post(`addresses/edit/${id}`, {addressData, addressId}, {withCredentials:true})
        console.log("returning success response from editAddress createAsyncThunk..."+JSON.stringify(response.data))
        return {id, addressId, address: response.data.address}
    }
    catch(error){
        console.log("inside catch of editAddress from addressSlice")
        const errorMessage = error.response?.data?.message
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const deleteAddress = createAsyncThunk('deleteAddress', async({addressId}, thunkAPI)=>{
    try{
        console.log("Inside deleteAddress createAsyncThunk")
        console.log("addressId---->", addressId)
        const response = await axios.delete(`addresses/delete/${addressId}`,{withCredentials:true})
        console.log("returning success response from deleteAddress createAsyncThunk..."+JSON.stringify(response.data))
        return {addressId, message: response.data.message}
    }
    catch(error){
        console.log("inside catch of deleteAddress from addressSlice")
        const errorMessage = error.response?.data?.message
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getAllAddress = createAsyncThunk('getAllAddress', async(thunkAPI)=>{
    try{
        console.log("Inside getAllAddress createAsyncThunk")
        const response = await axios.get('addresses', {withCredentials:true})
        console.log("returning success response from getAllAddress createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of getAllAddress from addressSlice")
        const errorMessage = error.response?.data?.message
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getDefaultAddress = createAsyncThunk('getDefaultAddress', async({id}, thunkAPI)=>{
    try{
        console.log("Inside getDefaultAddress createAsyncThunk")
        const response = await axios.get(`addresses/${id}/default`, {withCredentials:true})
        console.log("returning success response from getDefaultAddress createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of getDefaultAddress from addressSlice")
        const errorMessage = error.response?.data?.message
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const setAsDefaultAddress = createAsyncThunk('setAsDefaultAddress', async({addressId}, thunkAPI)=>{
    try{
        console.log("Inside setAsDefaultAddress createAsyncThunk")
        console.log("addressId---->", addressId)
        const response = await axios.put(`addresses/setAsDefault/${addressId}`,{withCredentials:true})
        console.log("returning success response from setAsDefaultAddress createAsyncThunk..."+JSON.stringify(response.data))
        return {addressId, message: response.data.message}
    }
    catch(error){
        console.log("inside catch of setAsDefaultAddress from addressSlice")
        const errorMessage = error.response?.data?.message
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
            console.log("action.payload.address-->",action.payload.address)
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
            console.log("action.payload.address-->",action.payload.address)
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
            console.log("action.payload.address-->",action.payload.addresses)
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
            console.log("action.payload.address-->",action.payload.addresses)
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
            console.log("action.payload.address-->",action.payload.address)
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
            console.log("action.payload.address-->",action.payload.addresses)
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
