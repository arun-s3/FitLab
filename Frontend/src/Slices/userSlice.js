import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const signup = createAsyncThunk('userSignup', async(formData, thunkAPI)=>{
    try{
        const response = await apiClient.post('/signup',formData)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const signin = createAsyncThunk('signin', async(formData, thunkAPI)=>{
    try{
        const response = await apiClient.post('/signin',formData)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const googleSignin = createAsyncThunk('googleSignin', async(userData,thunkAPI)=>{
    try{
        const response = await apiClient.post('/googleSignin',userData)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
} )

export const signout = createAsyncThunk('signout', async(_, thunkAPI)=>{
    try{ 
        const response = await apiClient.get('/signout')
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateUserDetails = createAsyncThunk('updateUserDetails', async({userDetails},thunkAPI)=>{
    try{
        const response = await apiClient.post('/update', {userDetails})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
} )

export const updateUserProfilePic = createAsyncThunk('updateUserProfilePic', async({formData},thunkAPI)=>{
    try{
        const response = await apiClient.put('/profilePic', formData, {headers: { "Content-Type": "multipart/form-data" }})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
} )

export const updateUserWeight = createAsyncThunk('updateUserWeight', async({userWeight},thunkAPI)=>{
    try{
        const response = await apiClient.put('/update/weight', {userWeight})
        return {userWeight}
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
} )

export const updateTermsAcceptance = createAsyncThunk('updateTermsAcceptance', async({consent},thunkAPI)=>{
    try{
        const response = await apiClient.post('/terms', {consent})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
} ) 


const initialState = {
    user: null,
    userUpdated: false,
    userDpUpdated: false,
    userWeightUpdated: false,
    updatedTermsAcceptance: false,
    currentPath: '',
    error:null,
    loading:false,
    success:false,
    googleSuccess:true
}
const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        resetStates: (state,action)=>{
            state.error = null
            state.loading = false
            state.success = false
            state.userUpdated = false
            state.userDpUpdated = false
            state.userWeightUpdated = false
            state.updatedTermsAcceptance = false
        },
        changePath: (state, action)=> {
            state.currentPath = action.payload.path
        },
        makeUserVerified: (state, action)=> {
            state.user.isVerified = true
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(signup.pending, (state,action)=>{
                state.loading = true
                state.success = false
            }
        )
        .addCase(signup.fulfilled, (state,action)=>{
                state.error = null
                state.loading = false
                state.success = true
                state.user = action.payload.user
        })
        .addCase(signup.rejected, (state,action)=>{
                state.error = action.payload
                state.loading = false
                state.success = false
        })
        .addCase(signin.pending, (state,action)=>{
                state.loading = true
                state.success = false
        })
        .addCase(signin.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true
                state.user = action.payload.user
        })
        .addCase(signin.rejected, (state,action)=>{
                state.error = action.payload
                state.loading = false
                state.success = false
         })
         .addCase(updateUserDetails.pending, (state,action)=>{
                state.loading = true
                state.success = false
        })
        .addCase(updateUserDetails.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true
                state.user = action.payload.user
                state.userUpdated =  true
        })
        .addCase(updateUserDetails.rejected, (state,action)=>{
                state.error = action.payload
                state.loading = false
                state.success = false
        })
        .addCase(updateUserProfilePic.pending, (state,action)=>{
                state.loading = true
                state.success = false
        })
        .addCase(updateUserProfilePic.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true 
                state.user.profilePic = action.payload.profilePic
                state.userDpUpdated =  true
        })
        .addCase(updateUserProfilePic.rejected, (state,action)=>{
                state.error = action.payload
                state.loading = false
                state.success = false
        })
        .addCase(updateUserWeight.pending, (state,action)=>{
                state.loading = true
                state.success = false
        })
        .addCase(updateUserWeight.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true 
                state.user.weight = action.payload.userWeight.weight
                state.userWeightUpdated = true
        })
        .addCase(updateUserWeight.rejected, (state,action)=>{
                state.error = action.payload
                state.loading = false
                state.success = false
        })
        .addCase(updateTermsAcceptance.pending, (state,action)=>{
                state.loading = true
                state.success = false
        })
        .addCase(updateTermsAcceptance.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true 
                state.user.hasAcceptedTerms = action.payload.hasAcceptedTerms
                state.user.termsAcceptedAt = action.payload.termsAcceptedAt
                state.user.termsVersion = action.payload.termsVersion
                state.updatedTermsAcceptance = true
        })
        .addCase(updateTermsAcceptance.rejected, (state,action)=>{
                state.error = action.payload
                state.loading = false
                state.success = false
        })
        .addCase(signout.fulfilled, (state,action)=>{
                state.user = null
                state.error = null,
                state.loading = false
                state.success = false
        })
        .addCase(googleSignin.pending, (state,action)=>{
                state.loading = true
                state.success = false
                state.googleSuccess = false
        })
        .addCase(googleSignin.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true
                state.googleSuccess = true
                state.user = action.payload.user
        })
        .addCase(googleSignin.rejected, (state,action)=>{
                state.error = action.payload
                state.loading = false
                state.success = false
                state.googleSuccess = false
        })
    
    }
})

export default userSlice.reducer
export const {resetStates, makeUserVerified} = userSlice.actions