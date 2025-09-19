import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const signup = createAsyncThunk('userSignup', async(formData, thunkAPI)=>{
    try{
        console.log("Inside signup createAsyncThunk")
        const response = await axios.post('/signup',formData)
        console.log("returning success response from signup createAsyncThunk..."+JSON.stringify(response))
        return response.data
    }
    catch(error){
        console.log("inside catch of signup from Userslice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const signin = createAsyncThunk('signin', async(formData, thunkAPI)=>{
    try{
        console.log("Inside signin createAsyncThunk")
        const response = await axios.post('/signin',formData,{withCredentials:true})
        console.log("returning success response from sigin createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of signup from Userslice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const googleSignin = createAsyncThunk('googleSignin', async(userData,thunkAPI)=>{
    try{
        console.log("inside googlesigin of createAsyncThunk")
        const response = await axios.post('/googleSignin',userData,{withCredentials:true})
        console.log("returning success response from googleSignin createAsyncThunk..."+JSON.stringify(response)) 
        console.log("userInfo from googleSignin createAsyncThunk--"+JSON.stringify(userData))
        return response.data
    }
    catch(error){
        console.log("inside catch of googleSignin from userSlice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response of googleSignin-->"+JSON.stringify(error.response))
        return thunkAPI.rejectWithValue(errorMessage)
    }
} )

export const signout = createAsyncThunk('signout', async(googleId,thunkAPI)=>{
    // console.log("inside userSlice signout-userToken"+userToken)
    try{ 
        console.log("inside userSlice googlesignout, googleId"+googleId)
        const response = googleId? await axios.get('/googlesignout',{withCredentials:true}) 
                                 : await axios.get('/signout',{withCredentials:true})
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

export const updateUserDetails = createAsyncThunk('updateUserDetails', async({userDetails},thunkAPI)=>{
    try{
        console.log("inside updateUserDetails of createAsyncThunk")
        const response = await axios.post('/update', {userDetails}, {withCredentials:true})
        console.log("returning success response from updateUserDetails createAsyncThunk..."+JSON.stringify(response)) 
        console.log("userDetails from updateUserDetails createAsyncThunk--"+JSON.stringify(userDetails))
        return response.data
    }
    catch(error){
        console.log("inside catch of updateUserDetails from userSlice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response of updateUserDetails-->"+JSON.stringify(error.response))
        return thunkAPI.rejectWithValue(errorMessage)
    }
} )

// export const resetPassword = resetPasswords('updateUserDetails', async({currentPassword, newPassword, confirmPassword}, thunkAPI)=>{
//     try{
//         console.log("inside updateUserDetails of createAsyncThunk")
//         const response = await axios.post('/update', {currentPassword, newPassword, confirmPassword}, {withCredentials:true})
//         console.log("returning success response from updateUserDetails createAsyncThunk..."+JSON.stringify(response)) 
//         console.log("userDetails from updateUserDetails createAsyncThunk--"+JSON.stringify(userDetails))
//         return response.data
//     }
//     catch(error){
//         console.log("inside catch of updateUserDetails from userSlice")
//         const errorMessage = error.response?.data?.message
//         console.log("error object inside createAsyncThunk error.response of updateUserDetails-->"+JSON.stringify(error.response))
//         return thunkAPI.rejectWithValue(errorMessage)
//     }
// } )

const initialState = {
    userToken: null,
    user: null,
    userUpdated: false,
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
            console.log("state(success) before reset-->"+state.success)
            console.log("Reseting states..inside resetStates() of userSlice ")
            state.error = null
            state.loading = false
            state.success = false
            console.log("state(success) after reset-->"+state.success)
        },
        changePath: (state, action)=> {
            console.log("changePage reducer")
            state.currentPath = action.payload.path
        },
        makeUserVerified: (state, action)=> {
            console.log("Making user verified....")
            state.user.isVerified = true
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(signup.pending, (state,action)=>{
                state.loading = true
                state.success = false
                console.log("loading from userSlice signup.pending--"+state.loading)
            }
        )
        .addCase(signup.fulfilled, (state,action)=>{
                state.error = null
                state.loading = false
                state.success = true
                console.log("userData from userSlice-signup.fulfilled-user-->"+JSON.stringify(action.payload.user))
                console.log("message from userSlice-signup.fulfilled->"+JSON.stringify(action.payload.message))
        })
        .addCase(signup.rejected, (state,action)=>{
                console.log("error from userSlice- signup.rejected-->"+ state.error)
                console.log("error payload from userSlice-signup.rejected-->"+JSON.stringify(action.payload))
                state.error = action.payload
                state.loading = false
                state.success = false
        })
        .addCase(signin.pending, (state,action)=>{
                state.loading = true
                state.success = false
                console.log("loading from userSlice signin.pending--"+state.loading)
        })
        .addCase(signin.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true
                state.userToken = action.payload.token
                state.user = action.payload.user
                console.log("userData from userSlice-signin.fulfilled-user-->"+JSON.stringify(state.user))
                console.log("token from userSlice-signin.fulfilled-token-->"+JSON.stringify(state.userToken))
                console.log("message from userSlice-signin.fulfilled->"+JSON.stringify(action.payload.message))
        })
        .addCase(signin.rejected, (state,action)=>{
                console.log("error from userSlice- signin.rejected before assignment-->"+ state.error)
                console.log("error payload from userSlice- signin.rejected-->"+JSON.stringify(action.payload))
                state.error = action.payload
                state.loading = false
                state.success = false
                console.log("error from userSlice- signin.rejected after assignment-->"+ state.error)
         })
         .addCase(updateUserDetails.pending, (state,action)=>{
                state.loading = true
                state.success = false
                console.log("loading from userSlice updateUserDetails.pending--"+state.loading)
        })
        .addCase(updateUserDetails.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true
                state.user = action.payload.user
                state.userUpdated =  true
                console.log("userData from userSlice-updateUserDetails.fulfilled-user-->"+JSON.stringify(state.user))
        })
        .addCase(updateUserDetails.rejected, (state,action)=>{
                state.error = action.payload
                state.loading = false
                state.success = false
                console.log("error from userSlice- updateUserDetails.rejected after assignment-->"+ state.error)
        })
        .addCase(signout.fulfilled, (state,action)=>{
                console.log("inside signout.fulfilled, action.payload"+JSON.stringify(action.payload))
                state.userToken = null
                state.user = null
                state.error = null,
                state.loading = false
                state.success = false
                console.log("state.userToken now-->"+state.userToken )
        })
        .addCase(googleSignin.pending, (state,action)=>{
                state.loading = true
                state.success = false
                state.googleSuccess = false
                console.log("loading from userSlice googleSignin.pending--"+state.loading)
        })
        .addCase(googleSignin.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true
                state.googleSuccess = true
                state.userToken = action.payload.token
                state.user = action.payload.user
                // console.log("userData from userSlice--user-->"+JSON.stringify(state.user))
                console.log("token from userSlice googleSignin--token-->"+JSON.stringify(state.userToken))
                console.log("message from userSlice googleSignin-->"+JSON.stringify(action.payload.message))
        })
        .addCase(googleSignin.rejected, (state,action)=>{
                console.log("error from userSlice- signin.rejected before assignment-->"+ state.error)
                console.log("error payload from userSlice- signin.rejected-->"+JSON.stringify(action.payload))
                state.error = action.payload
                state.loading = false
                state.success = false
                state.googleSuccess = false
                console.log("error from userSlice- signin.rejected after assignment-->"+ state.error)
        })
    
    }
})

export default userSlice.reducer
export const {resetStates, makeUserVerified} = userSlice.actions