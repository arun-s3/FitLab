import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const adminSignin = createAsyncThunk('adminsignin', async(formData, thunkAPI)=>{
    try{
        console.log("Inside adminSignin createAsyncThunk")
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

export const adminSignout = createAsyncThunk('adminSignout', async(thunkAPI)=>{
    try{ 
        console.log("Inside adminSignout createAsyncThunk")
        const response = await axios.get('/admin/signout',{withCredentials:true})
        console.log("response from signout createAsyncThunk-->"+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of signout from Userslice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const showUsers = createAsyncThunk('showUsers', async(thunkAPI)=>{
    try{
        console.log("Inside createAsyncThunk for getUsers")
        const response = await axios.get('/admin/customers',{withCredentials:true})
        console.log("Response from createAsyncThunk for getUsers-->"+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createAsyncThunk for getUsers")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const showUsersofStatus = createAsyncThunk('showUsersofStatus', async({status}, thunkAPI)=>{
    try{
        console.log("Inside createAsyncThunk for showUsersofStatus")
        const response = await axios.get(`/admin/customersOfStatus/?status=${status}`,{withCredentials:true})
        console.log("Response from createAsyncThunk for showUsersofStatus-->"+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createAsyncThunk for showUsersofStatus")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const toggleBlockUser = createAsyncThunk('toggleBlockUser', async(id,thunkAPI)=>{
    try{
        console.log("Inside createAsyncThunk for toggleBlockUser")
        const response = await axios.get(`/admin/toggleblockuser?id=${id}`,{withCredentials:true})
        console.log("Response from createAsyncThunk for toggleBlockUser-->"+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createAsyncThunk for toggleBlockUser")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const deleteUser = createAsyncThunk('deleteUser', async(id,thunkAPI)=>{
    try{
        console.log("Inside createAsyncThunk for deleteUser")
        const response = await axios.get(`/admin/deleteuser?id=${id}`,{withCredentials:true})
        console.log("Response from createAsyncThunk for deleteUser-->"+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createAsyncThunk for deleteUser")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const deleteUsersList = createAsyncThunk('deleteUser', async(userList,thunkAPI)=>{
    try{
        console.log("Inside createAsyncThunk for deleteUser")
        const response = await axios.post('/admin/deleteuserslist',userList, {withCredentials:true})
        console.log("Response from createAsyncThunk for deleteUser-->"+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createAsyncThunk for deleteUser")
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
    adminMessage:null,
    allUsers:null
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
            state.adminMessage = null
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
        .addCase(adminSignout.fulfilled, (state,action)=>{
           console.log("inside adminSignout.fulfilled, action.payload"+JSON.stringify(action.payload))
           state.adminToken = null
           state.admin = null
           console.log("state.userToken now-->"+state.adminToken)
    })
        .addCase(adminSignout.rejected, (state,action)=>{
            console.log("inside adminSignout.rejected"+JSON.stringify(action.payload))
            console.log("state.userToken now-->"+state.adminToken)
 })
        .addCase(showUsers.pending, (state,action)=>{
            console.log("Inside showUsers.pending")
            state.adminLoading = true
            state.success = false
            state.adminError = false
        })
        .addCase(showUsers.fulfilled, (state,action)=>{
            console.log("Inside showUsers.fulfilled")
            state.adminLoading = false
            state.success = true
            state.adminError = false
            state.allUsers = action.payload.users
            console.log("allUsers from showUsers.fulfilled"+JSON.stringify(action.payload))
        })
        .addCase(showUsers.rejected, (state,action)=>{
            console.log("Inside showUsers.rejected")
            state.adminLoading = false
            state.success = false
            state.adminError = true
        })
        .addCase(showUsersofStatus.pending, (state,action)=>{
            console.log("Inside showUsersofStatus.pending")
            state.adminLoading = true
            state.success = false
            state.adminError = false
        })
        .addCase(showUsersofStatus.fulfilled, (state,action)=>{
            console.log("Inside showUsersofStatus.fulfilled")
            state.adminLoading = false
            state.success = true
            state.adminError = false
            state.allUsers = action.payload.users
            console.log("allUsers from showUsersofStatus.fulfilled"+JSON.stringify(action.payload))
        })
        .addCase(showUsersofStatus.rejected, (state,action)=>{
            console.log("Inside showUsers.rejected")
            state.adminLoading = false
            state.success = false
            state.adminError = true
        })
        .addCase(toggleBlockUser.pending, (state,action)=>{
            console.log("Inside toggleBlockUser.pending")
            state.adminLoading = true
            state.success = false
            state.adminError = false
        })
        .addCase(toggleBlockUser.fulfilled, (state,action)=>{
            console.log("Inside toggleBlockUser.fulfilled")
            state.adminLoading = false
            state.success = true
            state.adminError = false
            state.adminMessage = action.payload.message
            console.log("allUsers from toggleBlockUser.fulfilled"+JSON.stringify(action.payload))
        })
        .addCase(toggleBlockUser.rejected, (state,action)=>{
            console.log("Inside toggleBlockUser.rejected")
            state.adminLoading = false
            state.success = false
            state.adminError = true
        })
        .addCase(deleteUser.pending||deleteUsersList.pending, (state,action)=>{
            console.log("Inside deleteUser.pending")
            state.adminLoading = true
            state.success = false
            state.adminError = false
        })
        .addCase(deleteUser.fulfilled||deleteUsersList.fulfilled, (state,action)=>{
            console.log("Inside deleteUser.fulfilled")
            state.adminLoading = false
            state.success = true
            state.adminError = false
            state.adminMessage = action.payload.message
            console.log("allUsers from deleteUser.fulfilled"+JSON.stringify(action.payload))
        })
        .addCase(deleteUser.rejected||deleteUserLists.rejected, (state,action)=>{
            console.log("Inside deleteUser.rejected")
            state.adminLoading = false
            state.success = false
            state.adminError = true
        })
    }

})

export default adminSlice.reducer
export const {resetStates} = adminSlice.actions