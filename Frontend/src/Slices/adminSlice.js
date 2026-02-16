import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const adminSignin = createAsyncThunk('adminsignin', async(formData, thunkAPI)=>{
    try{
        const response = await apiClient.post('/admin/signin',formData)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while logging in.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const adminSignout = createAsyncThunk('adminSignout', async(thunkAPI)=>{
    try{ 
        const response = await apiClient.get('/admin/signout')
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while logging out.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateAdminDetails = createAsyncThunk("updateAdminDetails", async ({ userDetails }, thunkAPI) => {
    try {
        const response = await apiClient.post("/admin/update", { userDetails })
        return response.data
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || "Something went wrong while updating. Please try again later."
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateAdminProfilePic = createAsyncThunk('updateAdminProfilePic', async({formData},thunkAPI)=>{
    try{
        const response = await apiClient.put('/admin/profilePic', formData, {headers: { "Content-Type": "multipart/form-data" }})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while updating profile pic. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
} )

export const showUsers = createAsyncThunk('showUsers', async({queryOptions}, thunkAPI)=>{
    try{
        const response = await apiClient.post('/admin/customers', {queryOptions})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while loading customers. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const toggleBlockUser = createAsyncThunk('toggleBlockUser', async(id,thunkAPI)=>{
    try{
        const response = await apiClient.get(`/admin/toggleblockuser?id=${id}`)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while toggling status. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateRiskyUserStatus = createAsyncThunk('updateRiskyUserStatus', async({riskDetails} ,thunkAPI)=>{
    try{ 
        const response = await apiClient.put(`/admin/risk/${riskDetails.userId}`, {riskDetails})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong. Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

const initialState = {
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
            state.adminError = null
            state.adminLoading = false
            state.adminSuccess = false
            state.adminMessage = null
            state.adminUpdated = false
            state.adminDpUpdated = false
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(adminSignin.pending, (state,action)=>{
            state.adminLoading = true
            state.adminSuccess = false
        })
        .addCase(adminSignin.fulfilled, (state,action)=>{
            state.adminLoading = false
            state.adminError = null
            state.adminSuccess = true
            state.admin = action.payload.admin
        })
        .addCase(adminSignin.rejected, (state,action)=>{
            state.adminError = action.payload
            state.adminLoading = false
            state.adminSuccess = false
        })
        .addCase(adminSignout.fulfilled, (state,action)=>{
           state.admin = null
        })
        .addCase(adminSignout.rejected, (state,action)=>{
        })
        .addCase(updateAdminDetails.pending, (state,action)=>{
            state.loading = true
            state.success = false
        })
        .addCase(updateAdminDetails.fulfilled, (state,action)=>{
            state.loading = false
            state.error = null
            state.success = true
            state.admin = action.payload.user
            state.adminUpdated =  true
        })
        .addCase(updateAdminDetails.rejected, (state,action)=>{
            state.error = action.payload
            state.loading = false
            state.success = false
            state.adminUpdated = false
        })
        .addCase(updateAdminProfilePic.pending, (state,action)=>{
            state.loading = true
            state.success = false
        })
        .addCase(updateAdminProfilePic.fulfilled, (state,action)=>{
            state.loading = false
            state.error = null
            state.success = true 
            state.admin.profilePic = action.payload.profilePic
            state.adminDpUpdated =  true
        })
        .addCase(updateAdminProfilePic.rejected, (state,action)=>{
            state.error = action.payload
            state.loading = false
            state.success = false
            state.adminDpUpdated = false
        })
        .addCase(showUsers.pending, (state,action)=>{
            state.adminLoading = true
            state.success = false
            state.adminError = false
        })
        .addCase(showUsers.fulfilled, (state,action)=>{
            state.adminLoading = false
            state.success = true
            state.adminError = false
            state.allUsers = action.payload.users
            state.totalUsers = action.payload.totalUsers
        })
        .addCase(showUsers.rejected, (state,action)=>{
            state.adminLoading = false
            state.success = false
            state.adminError = true
        })
        .addCase(toggleBlockUser.pending, (state,action)=>{
            state.adminLoading = true
            state.success = false
            state.adminError = false
        })
        .addCase(toggleBlockUser.fulfilled, (state,action)=>{
            state.adminLoading = false
            state.success = true
            state.adminError = false
            state.adminMessage = action.payload.message
        })
        .addCase(toggleBlockUser.rejected, (state,action)=>{
            state.adminLoading = false
            state.success = false
            state.adminError = true
        })
        .addCase(updateRiskyUserStatus.pending, (state, action) => {
          state.adminLoading = true
          state.success = false
          state.adminError = false
        })
        .addCase(updateRiskyUserStatus.fulfilled, (state, action) => {
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
          state.adminLoading = false
          state.success = false
          state.adminError = true
          state.adminMessage = action.payload
        })

    }

})

export default adminSlice.reducer
export const {resetStates} = adminSlice.actions