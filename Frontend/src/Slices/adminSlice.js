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
        console.log("inside catch of adminSigin from adminSlice")
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
        console.log("inside catch of signout from adminSlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateAdminDetails = createAsyncThunk("updateAdminDetails", async ({ userDetails }, thunkAPI) => {
    try {
        console.log("inside updateAdminDetails of createAsyncThunk")
        const response = await axios.post("/admin/update", { userDetails }, { withCredentials: true })
        console.log("returning success response from updateAdminDetails createAsyncThunk..." + JSON.stringify(response))
        console.log("userDetails from updateAdminDetails createAsyncThunk--" + JSON.stringify(userDetails))
        return response.data
    } catch (error) {
        console.log("inside catch of updateAdminDetails from adminSlice")
        const errorMessage =
            error.response?.data?.message || error.message || "Something went wrong.  Please try again later."
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateAdminProfilePic = createAsyncThunk('updateAdminProfilePic', async({formData},thunkAPI)=>{
    try{
        console.log("inside updateAdminProfilePic of createAsyncThunk")
        const response = await axios.put('/admin/profilePic', formData, {headers: { "Content-Type": "multipart/form-data" }, withCredentials: true})
        console.log("returning success response from updateAdminProfilePic createAsyncThunk..."+JSON.stringify(response)) 
        return response.data
    }
    catch(error){
        console.log("inside catch of updateAdminProfilePic from adminSlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
} )

export const showUsers = createAsyncThunk('showUsers', async({queryOptions}, thunkAPI)=>{
    try{
        console.log("Inside createAsyncThunk for getUsers")
        const response = await axios.post('/admin/customers', {queryOptions}, {withCredentials:true})
        console.log("Response from createAsyncThunk for getUsers-->"+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createAsyncThunk for getUsers")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
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
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateRiskyUserStatus = createAsyncThunk('updateRiskyUserStatus', async({riskDetails} ,thunkAPI)=>{
    try{ 
        console.log("Inside createAsyncThunk for updateRiskyUserStatus")
        console.log("riskDetails---->", riskDetails)
        const response = await axios.put(`/admin/risk/${riskDetails.userId}`, {riskDetails}, {withCredentials:true})
        console.log("Response from createAsyncThunk for updateRiskyUserStatus-->"+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createAsyncThunk for updateRiskyUserStatus")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
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
    adminUpdated:false,
    adminDpUpdated:false,
    allUsers:null,
    totalUsers: null
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
            state.adminUpdated = false
            state.adminDpUpdated = false
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
        .addCase(updateAdminDetails.pending, (state,action)=>{
            state.loading = true
            state.success = false
            console.log("loading from adminSlice updateAdminDetails.pending--"+state.loading)
        })
        .addCase(updateAdminDetails.fulfilled, (state,action)=>{
            state.loading = false
            state.error = null
            state.success = true
            state.admin = action.payload.user
            state.adminUpdated =  true
            console.log("userData from adminSlice-updateAdminDetails.fulfilled-user-->"+JSON.stringify(state.user))
        })
        .addCase(updateAdminDetails.rejected, (state,action)=>{
            state.error = action.payload
            state.loading = false
            state.success = false
            state.adminUpdated = false
            console.log("error from adminSlice- updateAdminDetails.rejected after assignment-->"+ state.error)
        })
        .addCase(updateAdminProfilePic.pending, (state,action)=>{
            state.loading = true
            state.success = false
            console.log("loading from adminSlice updateUserDetails.pending--"+state.loading)
        })
        .addCase(updateAdminProfilePic.fulfilled, (state,action)=>{
            state.loading = false
            state.error = null
            state.success = true 
            state.admin.profilePic = action.payload.profilePic
            state.adminDpUpdated =  true
            console.log("userData from adminSlice-updateUserDetails.fulfilled-user-->"+JSON.stringify(state.user))
        })
        .addCase(updateAdminProfilePic.rejected, (state,action)=>{
            state.error = action.payload
            state.loading = false
            state.success = false
            state.adminDpUpdated = false
            console.log("error from adminSlice- updateUserDetails.rejected after assignment-->"+ state.error)
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
            state.totalUsers = action.payload.totalUsers
            console.log("allUsers from showUsers.fulfilled"+JSON.stringify(action.payload))
        })
        .addCase(showUsers.rejected, (state,action)=>{
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
        .addCase(updateRiskyUserStatus.pending, (state, action) => {
          console.log("Inside updateRiskyUserStatus.pending")
          state.adminLoading = true
          state.success = false
          state.adminError = false
        })
        .addCase(updateRiskyUserStatus.fulfilled, (state, action) => {
          console.log("Inside updateRiskyUserStatus.fulfilled")
          state.adminLoading = false
          state.success = true
          state.adminError = false
          state.adminMessage = action.payload.message

          if (action.payload.updatedUser) {
            const updated = action.payload.updatedUser
            const index = state.allUsers?.findIndex(u=> u._id === updated._id)
            if (index !== -1) {
              state.allUsers[index] = updated
            }
          }
        })
        .addCase(updateRiskyUserStatus.rejected, (state, action) => {
          console.log("Inside updateRiskyUserStatus.rejected")
          state.adminLoading = false
          state.success = false
          state.adminError = true
          state.adminMessage = action.payload
        })

    }

})

export default adminSlice.reducer
export const {resetStates} = adminSlice.actions