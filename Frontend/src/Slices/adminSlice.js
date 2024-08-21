import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const adminSignin = createAsyncThunk('signin', async(formData, thunkAPI)=>{
    try{
        const response = await axios.post('/admin/signin',formData,{withCredentials:true})
        console.log("returning success response from adminSigin createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of adminSigin from Userslice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

const initialState = {
    adminToken: null,
    admin: null,
    adminError:null,
    adminLoading:false,
    adminSuccess:false,
}
const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        resetStates: (state,action)=>{
            console.log("state(adminSuccess) before reset-->"+state.adminSuccess)
            console.log("Reseting states")
            state.adminError = null
            state.adminLoading = false
            state.adminSuccess = false
            console.log("state(adminSuccess) after reset-->"+state.adminSuccess)
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(adminSignin.pending, (state,action)=>{
            state.adminLoading = true
            state.adminSuccess = false
            console.log("Loading from adminSlice adminsignin.pending--"+state.adminLoading)
    })
        .addCase(adminSignin.fulfilled, (state,action)=>{
            state.adminLoading = false
            state.adminError = null
            state.adminSuccess = true
            state.adminToken = action.payload.adminToken
            state.admin = action.payload.admin
            console.log("adminData from adminSlice--admin-->"+JSON.stringify(state.admin))
            console.log("adminToken from adminSlice--adminToken-->"+JSON.stringify(state.adminToken))
            console.log("message from adminSlice-->"+JSON.stringify(action.payload.message))
    })
        .addCase(adminSignin.rejected, (state,action)=>{
            console.log("Error from adminSlice- Adminsignin.rejected before assignment-->"+ state.adminError)
            console.log("Error payload from adminSlice- Adminsignin.rejected-->"+JSON.stringify(action.payload))
            state.adminError = action.payload
            state.adminLoading = false
            state.adminSuccess = false
            console.log("Error from adminSlice- Adminsignin.rejected after assignment-->"+ state.adminError)
     })
    }

})

export default adminSlice.reducer
export const {resetStates} = adminSlice.actions